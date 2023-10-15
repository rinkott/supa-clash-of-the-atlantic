import React, { useEffect, useState } from 'react'

import Logo from '~/assets/logo-text.svg'
import { trpc } from '~/utils/trpc'

import type { VoiceActivity } from '~/server/routers/casters'
import Header from '~/components/header'
import AnimatedLogo from '~/components/animated-logo'

import Countdown from 'react-countdown'

const countdownRenderer = ({
	hours,
	minutes,
	seconds,
	completed,
}: {
	hours: number
	minutes: number
	seconds: number
	completed: boolean
}) => {
	if (completed) {
		return '00:00'
	} else {
		return (
			<span>
				{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
			</span>
		)
	}
}

function Intermission() {
	const [countdown, setCountdown] = useState<number>(0)

	trpc.countdown.subscribe.useSubscription(null, {
		onData(data) {
			setCountdown(data)
		},
	})

	return (
		<main className="w-screen h-screen bg-black flex items-center flex-col pt-32 text-white">
			<div className="mb-32">
				<Logo className="w-[946px]" />
			</div>
			<Header>
				<Countdown
					key={countdown}
					renderer={countdownRenderer}
					date={Date.now() + countdown * 1000}
					autoStart
				/>
			</Header>
			<footer className="w-full font-druk text-white text-2xl flex justify-between uppercase mt-auto p-8">
				<div>
					<span className="outline-text text-transparent">A</span>
					&nbsp; SUPA Tournaments &nbsp;
					<span className="outline-text text-transparent">production</span>
				</div>

				{/* <div>
					CASTED BY
					&nbsp;
					<span className="outline-text text-transparent">
						{casters.map((va) => va.caster.name).join(', ')}
					</span>
				</div> */}
			</footer>
		</main>
	)
}

export default Intermission
