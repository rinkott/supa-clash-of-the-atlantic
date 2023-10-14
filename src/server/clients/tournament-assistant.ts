import { Client, Models, Packets } from 'tournament-assistant-client'
import EventEmitter from 'events'
import TypedEmitter from 'typed-emitter'
import { z } from 'zod'
import { SignupPlayer, getSignupPlayer } from '../../utils/signups'

export type SerializedTAPlayer = ReturnType<Models.User['toObject']>
export type SerializedTAMatch = ReturnType<Models.Match['toObject']>

export type ScorePushEvent = {
	platformId: string

	data: {
		accuracy: number
		combo: number
		notesMissed: number
		fc: boolean
		score: number
		songPosition: number
	}
}

export type TAEvents = {
	scorePush: (score: ScorePushEvent) => void
	matchUpdated: (match: SerializedTAMatch) => void
}

export type CombinedPlayer = {
	taPlayer: SerializedTAPlayer
	signupPlayer: SignupPlayer
}

export class TournamentAssistantClient {
	private taClient: Client

	currentMatch: Models.Match | null = null

	ee: TypedEmitter<TAEvents> = new EventEmitter() as TypedEmitter<TAEvents>

	connectOptions: {
		url: string
		password?: string
	}

	constructor(url: string, username: string, password?: string) {
		this.connectOptions = {
			url,
			password,
		}

		this.taClient = new Client(username, {
			url: this.connectOptions.url,
			password: this.connectOptions?.password,
			options: {
				autoReconnect: true,
				autoReconnectInterval: 1_000,
			},
		})

		this.handleEvents()

		console.log('TA Client started')
	}

	async handleEvents() {
		if (!this.taClient) return

		this.taClient.on('userAdded', async ({ data }) => {
			const playerId = data.user_id

			const signupPlayer = getSignupPlayer(playerId)

			console.log(
				`Player ${data.name} joined the server. Signup player: ${signupPlayer}`
			)

			if (!signupPlayer) {
				this.taClient?.sendMessage(
					[data.guid],

					new Packets.Command.ShowModal({
						message_title: 'Error',
						message_text:
							'You are not registered as a player\nfor this tournament.\nYou can leave the server.',
						can_close: false,
					})
				)
				return
			}
		})

		this.taClient.on('realtimeScore', ({ data }) => {
			const taPlayer = this.taClient.getUser(data.user_guid)
			if (!taPlayer) return

			const signupPlayer = getSignupPlayer(taPlayer.user_id)
			if (!signupPlayer) return

			const player = {
				taPlayer: taPlayer.toObject(),
				signupPlayer,
			} satisfies CombinedPlayer

			this.ee.emit('scorePush', {
				platformId: player.signupPlayer.platformId,

				data: {
					accuracy: data.accuracy,
					combo: data.combo,
					notesMissed: data.notesMissed + data.badCuts,
					fc:
						data.wallHits === 0 &&
						data.notesMissed === 0 &&
						data.badCuts === 0 &&
						data.bombHits === 0,
					score: data.score,
					songPosition: data.song_position,
				},
			})
		})

		this.taClient.on('matchCreated', async ({ data }) => {
			console.log('TA: Match created')

			// Join match on creation for TA to send realtimeScore events
			data.associated_users.push(this.taClient.Self.guid)
			this.taClient.updateMatch(data)
		})

		this.taClient.on('matchUpdated', async ({ data }) => {
			this.currentMatch = data

			this.ee.emit('matchUpdated', data.toObject())
		})
	}
}
