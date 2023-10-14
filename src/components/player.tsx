import React, { ReactEventHandler, useEffect } from 'react'
import NumberAnimation from './number-animation'
import clsx from 'clsx'
import { toTwemojiFlag } from '~/utils/twemoji'
import { useBeatLeaderPlayer } from '~/hooks/use-beatleader'
import { getContrastingColor } from '~/utils/colors'

function Player(props: {
	platformId: string
	username: string
	twitchUsername: string
	avatarLink: string

	combo: number
	misses: number
	accuracy: number

	isRight?: boolean
	isTop?: boolean

	isMvp?: boolean

	unmuted?: boolean
	streamEnabled?: boolean
}) {
	const { player } = useBeatLeaderPlayer(props.platformId)

	const onError: ReactEventHandler<HTMLImageElement> = (e) => {
		e.currentTarget.src = 'https://cdn.scoresaber.com/avatars/oculus.png'
	}

	return (
		<div
			className={clsx(
				props.isMvp && 'shadow-mvp z-10 border-2 border-yellow-300',
				'w-[100%] h-[400px] flex p-4 relative transition-shadow duration-500 overflow-hidden'
			)}
		>
			<div
				className={clsx(
					props.isMvp && 'opacity-100',
					'opacity-0 absolute top-0 left-[50%] z-30 transform translate-x-[-50%] bg-yellow-300 font-bold px-2 py-[3px] text-sm rounded-b-md transition-opacity duration-500 text-black'
				)}
			>
				MVP
			</div>

			<div
				className={clsx(
					props.isRight && 'flex-row-reverse',
					props.isTop ? 'mb-auto' : 'mt-auto',
					'w-full flex justify-between text-white z-20'
				)}
			>
				<div
					className={clsx(
						props.isRight && 'flex-row-reverse',
						'flex items-center gap-3 z-20'
					)}
				>
					<img
						src={props.avatarLink}
						className={clsx(
							props.isMvp && 'border-4 border-yellow-300',
							'w-11 h-11 rounded-full shadow-xl transition-all delay-500'
						)}
						onError={onError}
					/>

					<div className="flex flex-col">
						<h2
							className={clsx(
								props.isRight && 'text-right',
								'text-2xl text-white font-bold w-full inline-block shadow-2xl'
							)}
						>
							{props.username}
						</h2>
						{player ? (
							<ul
								className={clsx(
									props.isRight && 'flex-row-reverse',
									'list-none flex gap-2'
								)}
							>
								<li>
									<img
										className="w-[20px]"
										src={toTwemojiFlag(player?.country)}
									/>
								</li>

								{player.clans.map((clan) => (
									<li
										key={clan.id}
										className="px-[4px] text-[13px] rounded-md border-2 bg-black font-medium"
										style={{
											borderColor: clan.color,
										}}
									>
										{clan.tag}
									</li>
								))}
							</ul>
						) : null}
					</div>
				</div>

				<div
					className={clsx(
						!props.isRight && 'items-end',
						'flex flex-col font-poppins justify-center text-[25px] z-20'
					)}
				>
					<span className="font-medium leading-none">
						{props.accuracy ? (props.accuracy * 100).toFixed(2) : '00.00'}%
					</span>

					<div className="flex items-end gap-1">
						<span className="font-bold leading-none shadow-xl">
							{/* <NumberAnimation value={props.combo} duration={200} />x */}
							<span>{props.combo || 0}x</span>
						</span>
						<span className="text-[#EE6161] font-semibold text-sm leading-none shadow-xl">
							{/* <NumberAnimation value={props.misses} duration={200} />x */}
							<span>{props.misses || 0}x</span>
						</span>
					</div>
				</div>

				{props.streamEnabled && (
					<iframe
						src={`https://player.twitch.tv/?channel=${props.twitchUsername}&parent=cota.horny.cat&muted=${!props.unmuted}`}
						className="absolute inset-0 w-[730px] h-[410px] z-10 left-[50%] transform translate-x-[-50%]"
					></iframe>
				)}
			</div>
		</div>
	)
}

export default Player
