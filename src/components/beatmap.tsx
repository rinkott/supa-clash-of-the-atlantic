import React, { useEffect, useState } from 'react'
import BeatSaverAPI from 'beatsaver-api'
import { MapDetail } from 'beatsaver-api/lib/models/MapDetail'
import clsx from 'clsx'
import Marquee from 'react-fast-marquee'

const api = new BeatSaverAPI({
	AppName: 'supa-overlay',
	Version: '0.0.1',
})

function secondsToMinutes(seconds: number) {
	const minutes = Math.floor(seconds / 60)
	const secondsLeft = seconds % 60

	return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`
}

const difficulties = ['Easy', 'Normal', 'Hard', 'Expert', 'ExpertPlus'] as const

export type Difficulty = (typeof difficulties)[number]

const difficultyToColor: Record<Difficulty, string> = {
	Easy: 'beatsaver-green',
	Normal: 'beatsaver-blue',
	Hard: 'beatsaver-orange',
	Expert: 'beatsaver-red',
	ExpertPlus: 'beatsaver-purple',
}

function BeatMap(props: {
	hash?: string
	diff?: Difficulty
	mapProgress?: number
}) {
	const [map, setMap] = useState<MapDetail>()

	useEffect(() => {
		async function getMap() {
			if (!props.hash) return

			const responce = await api.getMapByHash(props.hash)

			setMap(responce)
		}

		getMap()
	}, [props.hash])

	return (
		<div className="flex gap-4 w-[677px] h-[85px] text-white bg-no-repeat bg-cover bg-center relative rounded-xl pr-3 overflow-hidden">
			<div className="absolute inset-0 rounded-xl">
				<div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-xl"></div>
				<img
					src={map?.versions[0].coverURL}
					className="w-full h-full object-cover rounded-xl border-[2px] border-black"
				/>
			</div>

			<div className="flex flex-col justify-center gap-1 p-4">
				<h2 className="font-poppins text-base font-semibold">
					<Marquee
						speed={12}
						className="max-w-[450px]"
						key={map?.name || 1}
						play={map && map.name.length > 100}
					>
						{map?.name}
					</Marquee>
				</h2>
				<h3 className="font-poppins text-base font-normal z-10">
					{map?.metadata.levelAuthorName}
				</h3>
			</div>

			<div className="ml-auto justify-center gap-1 p-4 opacity-70 text-right">
				<h2 className="font-poppins text-base font-medium">!{map?.id}</h2>
				<h3 className="font-poppins text-base font-medium w-full">
					{secondsToMinutes(map?.metadata.duration || 0)}
				</h3>
			</div>

			<div className="flex gap-2 flex-col rotate -rotate-90 text-center font-bold text-[12px]">
				<div className="text-white p-1 px-2 rounded-md bg-black">
					{map?.metadata.bpm}bpm
				</div>

				<div
					className={clsx(
						`bg-${difficultyToColor[props.diff || 'Easy']}`,
						'text-white p-1 px-2 rounded-md uppercase'
					)}
				>
					{props.diff?.replace('Plus', '+') || 'Easy'}
				</div>
			</div>

			<div
				className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400 transition-all duration-1000"
				style={{
					width: `${(props.mapProgress || 1) / (map?.metadata.duration || 1) * 100}%`,
				}}
			></div>
		</div>
	)
}

export default BeatMap
