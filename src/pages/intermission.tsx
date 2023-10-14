import React, { useEffect, useState } from 'react'

import Logo from '~/assets/logo-text.svg'
import { trpc } from '~/utils/trpc'

import type { VoiceActivity } from '~/server/routers/casters'
import Header from '~/components/header'
import AnimatedLogo from '~/components/animated-logo'

function Intermission() {
	const [casters, setCasters] = useState<VoiceActivity[]>([])

	const [countdown, setCountdown] = useState<number>()

	const [seconds, setSeconds] = useState(0)

	trpc.caster.subscribeToCasters.useSubscription(null, {
		onData(data) {
			setCasters(data)
		},
	
		onStarted() {
			console.log('Listening for caster activity')
		},
	})

	trpc.countdown.subscribe.useSubscription(null, {
		onData(data) {
			setCountdown(data)
			setSeconds(data)
		},
	})

	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds((countdown) => countdown ? countdown - 1 : 0)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [countdown])

	const fullMinutes = countdown ? Math.floor(seconds / 60) : 0
	const timeLeft = countdown ? `${String(fullMinutes).padStart(2, '0')}:${String(seconds - fullMinutes  * 60).padStart(2, '0')}` : null

	return (
		<main className="w-screen h-screen bg-black flex items-center flex-col bg-dots pt-32 text-white">
			<div className="mb-32">
				<Logo className="w-[946px]" />
			</div>
			<Header>
				{timeLeft}
			</Header>
			<footer className="w-full font-druk text-white text-2xl flex justify-between uppercase mt-auto p-8">
				<div>
					<span className="outline-text text-transparent">A</span>
					&nbsp; SUPA Tournaments &nbsp;
					<span className="outline-text text-transparent">production</span>
				</div>

				<div>
					CASTED BY
					&nbsp;
					<span className="outline-text text-transparent">
						{casters.map((va) => va.caster.name).join(', ')}
					</span>
				</div>
			</footer>
		</main>
	)
}

export default Intermission
