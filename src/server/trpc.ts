import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.create({
	/**
	 * @see https://trpc.io/docs/v10/data-transformers
	 */
	transformer: superjson,
	/**
	 * @see https://trpc.io/docs/v10/error-formatting
	 */
	errorFormatter({ shape }) {
		return shape
	},
})

export const router = t.router

export const publicProcedure = t.procedure

export const middleware = t.middleware

export const mergeRouters = t.mergeRouters
