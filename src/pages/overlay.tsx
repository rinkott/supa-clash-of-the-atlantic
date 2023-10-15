import React, { useState } from 'react'
import Header from '~/components/header'
import Logo from '~/assets/logo.svg'
import NumberAnimation from '~/components/number-animation'
import Player from '~/components/player'
import Footer from '~/components/footer'
import { trpc } from '~/utils/trpc'
import { ScorePushEvent } from '~/server/clients/tournament-assistant'
import { getSignupPlayer, Teams } from '~/utils/signups'
import { boolean } from 'zod'
import clsx from 'clsx'
import { Difficulty } from '~/components/beatmap'

const TeamName = ({ children }: { children: React.ReactNode }) => (
	<h1 className="font-poppins text-4xl text-white">{children}</h1>
)

const EmptyStar = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="37"
		height="35"
		viewBox="0 0 37 35"
		fill="none"
	>
		<path
			d="M24.185 8.24799L24.185 8.24808C24.7545 9.38446 25.8527 10.1688 27.1193 10.3508L27.1195 10.3508L34.0161 11.3381L34.0162 11.3381C36.4014 11.6794 37.3323 14.552 35.6239 16.1933C35.6239 16.1934 35.6239 16.1934 35.6239 16.1934L30.6334 20.9862L30.6333 20.9863C29.7138 21.8696 29.2923 23.1447 29.5099 24.3963L29.51 24.3964L30.6878 31.1644C31.0898 33.4752 28.6205 35.273 26.4798 34.1639L26.4798 34.1639L20.3114 30.9684C19.1769 30.3807 17.8234 30.3807 16.6889 30.9684L10.5205 34.1639L10.5205 34.1639C8.37984 35.273 5.91051 33.4752 6.31253 31.1645C6.31253 31.1645 6.31254 31.1644 6.31254 31.1644L7.49036 24.3964C7.70808 23.1453 7.28641 21.8703 6.36716 20.9864L6.36695 20.9862L1.37637 16.1933C-0.3325 14.5522 0.598656 11.6794 2.98413 11.3381L2.98416 11.3381L9.88072 10.3508C9.88073 10.3508 9.88075 10.3508 9.88077 10.3508C11.1477 10.1696 12.2459 9.38505 12.8154 8.24796L15.8999 2.09006L15.8999 2.09003C16.9616 -0.0300083 20.038 -0.0300086 21.0997 2.09003L21.238 2.36613H21.2387L24.185 8.24799Z"
			stroke="#D9D9D9"
		/>
	</svg>
)

const FilledStar = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="37"
		height="35"
		viewBox="0 0 37 35"
		fill="none"
	>
		<path
			d="M21.5475 1.86601L24.632 8.02393C25.1271 9.01186 26.0836 9.69676 27.1904 9.85575L34.087 10.843C36.8743 11.2418 37.9866 14.6167 35.9703 16.5538L30.9797 21.3467C30.1791 22.1159 29.8136 23.2241 30.0025 24.3105L31.1804 31.0786C31.6562 33.8134 28.7427 35.8994 26.2498 34.6077L20.0814 31.4122C19.0911 30.8992 17.9092 30.8992 16.9189 31.4122L10.7505 34.6077C8.25764 35.8994 5.34412 33.8134 5.81994 31.0786L6.99776 24.3105C7.18671 23.2248 6.82122 22.1166 6.02061 21.3467L1.03003 16.5538C-0.987023 14.6167 0.125978 11.2418 2.91331 10.843L9.80992 9.85575C10.9167 9.69744 11.8732 9.01254 12.3683 8.02393L15.4528 1.86601C16.6989 -0.622165 20.3007 -0.622165 21.5468 1.86601H21.5475Z"
			fill="#D9D9D9"
		/>
	</svg>
)

const TeamScore = ({
	points,
	pointsMax,
	reversed,
}: {
	points: number
	pointsMax: number
	reversed?: boolean
}) => (
	<div className="flex items-center justify-center">
		<div className={clsx('flex gap-3', reversed && 'flex-row-reverse')}>
			{Array.from({ length: pointsMax }).map((_, i) => (
				<div key={i} className="w-[37px] h-[35px]">
					{i < points ? <FilledStar /> : <EmptyStar />}
				</div>
			))}
		</div>
	</div>
)

const LogoWithScore = ({
	pointsNa,
	pointsEu,
	pointsMax,
	category,
}: {
	pointsNa: number
	pointsEu: number
	pointsMax: number

	category?: string
}) => {
	return (
		<div className="absolute left-0 right-0 top-0 bottom-0 flex gap-11 items-center justify-center">
			<TeamScore points={pointsNa} pointsMax={pointsMax} reversed />
			<div className='flex flex-col items-center gap-2'>
				<Logo className="w-[80px]" />

				<span className="text-sm outline-text-sm spacing tracking-wider uppercase">
					{category}
				</span>
			</div>
			<TeamScore points={pointsEu} pointsMax={pointsMax} />
		</div>
	)
}

const levelIdRe = /custom_level_([0-9A-F]{40})/

const parseLevelHash = (hash: string | undefined | null) => {
	if (!hash) return null

	const match = hash.match(levelIdRe)

	if (!match) return null

	return match[1]
}

enum TADifficulty {
	'Easy' = 0,
	'Normal' = 1,
	'Hard' = 2,
	'Expert' = 3,
	'ExpertPlus' = 4,
}

const PlayerGrid = (props: { is3v3?: boolean; children: React.ReactNode }) => (
	<div
		className={clsx(
			props.is3v3
				? 'grid-cols-3 w-[1920px]'
				: 'grid-cols-2 grid-rows-2 w-[50vw]',
			'grid gap-0'
		)}
	>
		{props.children}
	</div>
)

const sum = (a: number, b: number) => a + b

function Overlay() {
	const [latestScores, setLatestScores] = useState<
		Record<string, ScorePushEvent>
	>({})

	const [rosterEurope, setRosterEurope] = useState<string[]>([])
	const [rosterNorthAmerica, setRosterNorthAmerica] = useState<string[]>([])

	const is3v3 = rosterEurope.length === 3

	trpc.match.subscribeToScores.useSubscription(null, {
		onData(data) {
			setLatestScores((old) => ({
				...old,
				[data.platformId]: data,
			}))
		},
	})

	trpc.match.subscribeToRosters.useSubscription(null, {
		onData(data) {
			setRosterEurope(data['EU'])
			setRosterNorthAmerica(data['NA'])
		},
	})

	const [levelId, setLevelId] = useState<string>('')

	const [diff, setDiff] = useState<Difficulty>('Easy')

	trpc.match.subscribeToMatch.useSubscription(null, {
		onData(data) {
			if (!data.selected_level) return

			setLevelId(parseLevelHash(data.selected_level?.level_id) || '')

			setDiff(TADifficulty[data.selected_difficulty || 0] as Difficulty)
		},
	})

	const teamEuropeScore = rosterEurope
		.map((id) => latestScores[id]?.data.score)
		.reduce(sum, 0)
	const teamNorthAmericaScore = rosterNorthAmerica
		.map((id) => latestScores[id]?.data.score)
		.reduce(sum, 0)

	const teamEuropeMisses = rosterEurope
		.map((id) => latestScores[id]?.data.notesMissed)
		.reduce(sum, 0)
	const teamNorthAmericaMisses = rosterNorthAmerica
		.map((id) => latestScores[id]?.data.notesMissed)
		.reduce(sum, 0)

	const teamEuropeAvgAcc =
		rosterEurope.map((id) => latestScores[id]?.data.accuracy).reduce(sum, 0) /
		rosterEurope.length
	const teamNorthAmericaAvgAcc =
		rosterNorthAmerica
			.map((id) => latestScores[id]?.data.accuracy)
			.reduce(sum, 0) / rosterNorthAmerica.length

	const [teamEuropePoints, setTeamEuropePoints] = useState(0)
	const [teamNorthAmericaPoints, setTeamNorthAmericaPoints] = useState(0)

	trpc.match.subscribeToPoints.useSubscription(null, {
		onData(data) {
			setTeamEuropePoints(data['EU'])
			setTeamNorthAmericaPoints(data['NA'])
		},
	})

	return (
		<div className="relative w-[1920px] h-[1080px] bg-black">
			<Header isDark>
				<div className="relative w-full flex items-center justify-between px-12">
					<TeamName>NORTH AMERICA</TeamName>
					<LogoWithScore
						pointsNa={teamNorthAmericaPoints || 0}
						pointsEu={teamEuropePoints || 0}
						pointsMax={4}

						category='Challenge'
					/>
					<TeamName>EUROPE</TeamName>
				</div>
			</Header>

			<div className={clsx(is3v3 && 'flex-col', 'flex w-screen')}>
				<PlayerGrid is3v3={is3v3}>
					{rosterEurope.map((id, i) => {
						const scoreForPlayer = latestScores[id]
						const signupPlayer = getSignupPlayer(id)

						if (!signupPlayer) return null

						const isMvp = scoreForPlayer?.data.songPosition > 5 && Math.max(
							...[...rosterEurope, ...rosterNorthAmerica].map((id) => latestScores[id]?.data.score || 0)
						) === scoreForPlayer?.data.score

						return (
							<Player
								key={id}
								username={signupPlayer?.username}
								twitchUsername={signupPlayer?.twitchUsername}
								combo={scoreForPlayer?.data.combo}
								misses={scoreForPlayer?.data.notesMissed}
								accuracy={scoreForPlayer?.data.accuracy}
								avatarLink={`https://cdn.scoresaber.com/avatars/${id}.jpg`}
								platformId={id}
								unmuted={i === 0}
								streamEnabled

								isMvp={isMvp}
							/>
						)
					})}
				</PlayerGrid>

				<PlayerGrid is3v3={is3v3}>
					{rosterNorthAmerica.map((id) => {
						const scoreForPlayer = latestScores[id]
						const signupPlayer = getSignupPlayer(id)

						if (!signupPlayer) return null

						const isMvp = scoreForPlayer?.data.songPosition > 5 && Math.max(
							...[...rosterEurope, ...rosterNorthAmerica].map((id) => latestScores[id]?.data.score || 0)
						) === scoreForPlayer?.data.score

						return (
							<Player
								key={id}
								username={signupPlayer?.username}
								twitchUsername={signupPlayer?.twitchUsername}
								combo={scoreForPlayer?.data.combo}
								misses={scoreForPlayer?.data.notesMissed}
								accuracy={scoreForPlayer?.data.accuracy}
								avatarLink={`https://cdn.scoresaber.com/avatars/${id}.jpg`}
								platformId={id}
								isTop={is3v3}
								isRight={!is3v3}
								unmuted={false}
								streamEnabled

								isMvp={isMvp}
							/>
						)
					})}
				</PlayerGrid>
			</div>

			<Footer
				leftTeamScore={teamNorthAmericaScore || 0}
				leftTeamAccuracy={teamNorthAmericaAvgAcc || 0}
				rightTeamScore={teamEuropeScore || 0}
				rightTeamAccuracy={teamEuropeAvgAcc || 0}
				leftTeamMisses={teamNorthAmericaMisses || 0}
				rightTeamMisses={teamEuropeMisses || 0}
				mapHash={levelId}
				diff={diff}

				mapProgress={latestScores[rosterEurope[0]]?.data.songPosition || 0}

				rankBy='misses'
			/>
		</div>
	)
}

export default Overlay
