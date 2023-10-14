import { router, publicProcedure } from '../trpc'
import { observable } from '@trpc/server/observable'
import { clearInterval } from 'timers'
import { casterRouter } from './casters'
import { countdownRouter } from './countdown'
import { matchRouter } from './match'

export const appRouter = router({
	healthcheck: publicProcedure.query(() => 'ping'),

	caster: casterRouter,
	countdown: countdownRouter,
	match: matchRouter,

	randomNumber: publicProcedure.subscription(() => {
		return observable<number>((emit) => {
			const int = setInterval(() => {
				emit.next(Math.random())
			}, 500)

			return () => {
				clearInterval(int)
			}
		})
	}),
})

export type AppRouter = typeof appRouter
