import TypedEmitter from 'typed-emitter'
import { publicProcedure, router } from '../trpc'
import { observable } from '@trpc/server/observable'
import EventEmitter from 'events'

type CountdownEvents = {
	updateCountdown: (n: number) => void
}

const ee = new EventEmitter() as TypedEmitter<CountdownEvents>

let currentCountdown = 15 * 60

export const countdownRouter = router({
	set: publicProcedure
		.input((i) => i as number)
		.mutation((i) => {
			const countdown = i.input

			ee.emit('updateCountdown', countdown)

			return true
		}),

	subscribe: publicProcedure
		.input(() => null)
		.subscription(() => {
			return observable<number>((emit) => {
				function broadcastCountdown(n: number) {
					currentCountdown = n

					emit.next(currentCountdown)
				}

				emit.next(currentCountdown)
				ee.on('updateCountdown', broadcastCountdown)

				return () => {
					ee.off('updateCountdown', broadcastCountdown)
				}
			})
		}),
})

export const countdownEventEmitter = ee
