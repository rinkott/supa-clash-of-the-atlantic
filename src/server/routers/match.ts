import TypedEmitter from 'typed-emitter'
import { publicProcedure, router } from '../trpc'
import { observable } from '@trpc/server/observable'
import EventEmitter from 'events'

import { Team } from '~/utils/signups'

import {
	ScorePushEvent,
	SerializedTAMatch,
	TournamentAssistantClient,
} from '../clients/tournament-assistant'

const taInterface = new TournamentAssistantClient(
	'ws://tournamentassistant.net:2053',
	'SUPA Bot'
)

type SelectedRosters = Record<Team, string[]>

const rosters: SelectedRosters = {
	EU: ['76561198313983208', '76561198988695829', '76561198180044686', '76561198362923485'],
	NA: ['76561198299618436', '76561198166289091', '76561198374714658', '76561198810052126'],
}

type TeamPoints = Record<Team, number>

const points: TeamPoints = {
	EU: 0,
	NA: 0,
}

let currentMaxPoints = 5

type RosterEvents = {
	updateRosters: (rosters: SelectedRosters) => void
}

type RosterUpdateInput = {
	roster: string[]
	team: Team
}

const rostersEE = new EventEmitter() as TypedEmitter<RosterEvents>

export const matchRouter = router({
	subscribeToScores: publicProcedure
		.input(() => null)
		.subscription(() => {
			return observable<ScorePushEvent>((emit) => {
				function broadcastScorePush(data: ScorePushEvent) {
					emit.next(data)
				}

				taInterface.ee.on('scorePush', broadcastScorePush)
				return () => {
					taInterface.ee.off('scorePush', broadcastScorePush)
				}
			})
		}),

	subscribeToMatch: publicProcedure
		.input(() => null)
		.subscription(() => {
			return observable<SerializedTAMatch>((emit) => {
				function broadcastMatch(data: SerializedTAMatch) {
					emit.next(data)
				}

				taInterface.ee.on('matchUpdated', broadcastMatch)
				return () => {
					taInterface.ee.off('matchUpdated', broadcastMatch)
				}
			})
		}),

	subscribeToRosters: publicProcedure
		.input(() => null)
		.subscription(() => {
			return observable<SelectedRosters>((emit) => {
				function broadcastRosters(rosters: SelectedRosters) {
					emit.next(rosters)
				}

				emit.next(rosters)

				rostersEE.on('updateRosters', broadcastRosters)
				return () => {
					rostersEE.off('updateRosters', broadcastRosters)
				}
			})
		}),

	setRoster: publicProcedure
		.input((i) => i as RosterUpdateInput)
		.mutation((i) => {
			const { roster, team } = i.input

			rosters[team] = roster

			rostersEE.emit('updateRosters', rosters)

			return true
		}),

	setPoints: publicProcedure
		.input((i) => i as {
			team: Team
			points: number
		})
		.mutation(({ input }) => {
			if (input.points > currentMaxPoints) {
				return false
			}

			points[input.team] = input.points

			return true
		}),
	
	setMaxPoints: publicProcedure
		.input((i) => i as number)
		.mutation((i) => {
			const maxPoints = i.input

			if (maxPoints < 1) {
				return false
			}

			currentMaxPoints = maxPoints

			return true
		}),
})
