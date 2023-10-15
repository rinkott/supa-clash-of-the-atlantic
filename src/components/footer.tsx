import React from 'react'
import BeatMap, { Difficulty } from './beatmap'

import LogoText from '../assets/logo-text-scaled.svg'
import NumberAnimation from './number-animation'

const TugOfWar = (props: {
	/**
	 * A number between 0 and 1 representing the accuracy of the left team.
	 */
	leftTeamAccuracy: number

	/**
	 * A number between 0 and 1 representing the accuracy of the right team.
	 */
	rightTeamAccuracy: number
}) => (
	<div className="w-full h-[9px] top-[-9px] relative overflow-hidden z-20">
		<div
			className="h-full max-w-[50%] bg-red-500 absolute left-[50%] transform translate-x-[-100%] transition-all duration-500"
			style={{
				width:
					props.leftTeamAccuracy > props.rightTeamAccuracy
						? `${(props.leftTeamAccuracy - props.rightTeamAccuracy) * 300}%`
						: '0',
			}}
		></div>
		<div
			className="h-full max-w-[50%] bg-blue-500 absolute left-[50%] transition-all duration-500"
			style={{
				width:
					props.rightTeamAccuracy > props.leftTeamAccuracy
						? `${(props.rightTeamAccuracy - props.leftTeamAccuracy) * 300}%`
						: '0',
			}}
		></div>
	</div>
)

const localeFormatter = (n: number) => Math.floor(n).toLocaleString()

const TeamScores = (props: {
	leftTeamScore: number
	rightTeamScore: number
	leftTeamAccuracy: number
	rightTeamAccuracy: number

	leftTeamMisses: number
	rightTeamMisses: number

	rankBy?: 'misses' | 'accuracy'
}) => (
	<div className="flex gap-[40px] pb-4 justify-center">
		<div className="flex flex-col text-right w-[150px]">
			<h1 className="font-bold text-1xl text-red-500 -mb-2">NA</h1>
			<h1 className="font-bold text-4xl -mb-1">
				{props.rankBy !== 'misses'
					? `${(props.leftTeamAccuracy * 100).toFixed(2)}%`
					: `${props.leftTeamMisses}x` || 0}
			</h1>
			<h2 className="font-bold text-[20px] inline-block w-full">
				<NumberAnimation
					value={props.leftTeamScore}
					formatter={localeFormatter}
					duration={200}
				/>
			</h2>
		</div>
		<div className="flex flex-col text-left w-[150px]">
			<h1 className="font-bold text-1xl text-blue-500 -mb-2">EU</h1>
			<h1 className="font-bold text-4xl -mb-1">
				{props.rankBy !== 'misses'
					? `${(props.rightTeamAccuracy * 100).toFixed(2)}%`
					: `${props.rightTeamMisses}x` || 0}
			</h1>
			<h2 className="font-bold text-[20px] inline-block w-full">
				<NumberAnimation
					value={props.rightTeamScore}
					formatter={localeFormatter}
					duration={200}
				/>
			</h2>
		</div>

		{props.rankBy === 'misses' ? (
			<>
				<div className="absolute opacity-80 -bottom-1 left-1/2 transform -translate-x-1/2 font-bold text-sm whitespace-nowrap">
					{Math.abs(props.leftTeamMisses - props.rightTeamMisses)}
				</div>
			</>
		) : (
			<div className="absolute opacity-80 -bottom-1 left-1/2 transform -translate-x-1/2 font-bold text-sm whitespace-nowrap">
				{Math.abs(props.leftTeamScore - props.rightTeamScore)} (
				{(
					Math.abs(props.leftTeamAccuracy - props.rightTeamAccuracy) * 100
				).toFixed(2)}
				%)
			</div>
		)}
	</div>
)

function Footer(props: {
	leftTeamScore: number
	leftTeamAccuracy: number

	rightTeamScore: number
	rightTeamAccuracy: number

	leftTeamMisses: number
	rightTeamMisses: number

	mapHash: string
	diff: Difficulty
	mapProgress?: number
	rankBy?: 'misses' | 'accuracy'
}) {
	return (
		<>
			<div className="w-full relative h-[133px] font-poppins text-white bg-footer-bar bg-cover bg-no-repeat z-30">
				<TugOfWar
					leftTeamAccuracy={props.leftTeamAccuracy}
					rightTeamAccuracy={props.rightTeamAccuracy}
				/>

				<div className="w-full h-full absolute inset-0 justify-between items-center px-9 flex">
					<BeatMap hash={props.mapHash} diff={props.diff} mapProgress={props.mapProgress} />

					<div className="absolute left-[50%] transform translate-x-[-50%]">
						<TeamScores
							leftTeamScore={props.leftTeamScore}
							rightTeamScore={props.rightTeamScore}
							leftTeamAccuracy={props.leftTeamAccuracy}
							rightTeamAccuracy={props.rightTeamAccuracy}
							leftTeamMisses={props.leftTeamMisses}
							rightTeamMisses={props.rightTeamMisses}
							rankBy={props.rankBy}
						/>
					</div>

					<LogoText className="w-[278px]" />
				</div>
			</div>
		</>
	)
}

export default Footer
