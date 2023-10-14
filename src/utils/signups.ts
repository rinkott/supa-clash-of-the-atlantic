import { default as signups } from '../assets/signups.json'

const PlayerTypes = [
	'CAPTAIN',
	'TECH',
	'ACCURACY',
	'CHALLENGE',
	'SPEED',
] as const

export const Teams = ['EU', 'NA'] as const

export type PlayerType = (typeof PlayerTypes)[number]

export type Team = (typeof Teams)[number]

export type SignupPlayer = {
	discordId: string
	username: string
	platformId: string
	type: PlayerType
	twitchUsername: string
	team: Team
}

export function getSignupPlayer(platformId: string): SignupPlayer | null {
	return (
		(signups.find(
			(signup) => signup.platformId === platformId
		) as SignupPlayer) || null
	)
}
