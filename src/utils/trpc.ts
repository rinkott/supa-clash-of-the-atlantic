import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { wsLink, createWSClient } from '@trpc/client/links/wsLink'
import { createTRPCNext } from '@trpc/next'
import { NextPageContext } from 'next'
import getConfig from 'next/config'
import type { AppRouter } from '~/server/routers/_app'
import superjson from 'superjson'
import type {
	inferProcedureInput,
	inferProcedureOutput,
	inferSubscriptionOutput,
} from '@trpc/server'

const { publicRuntimeConfig } = getConfig()

// const { APP_URL, WS_URL } = publicRuntimeConfig

function getEndingLink(ctx: NextPageContext | undefined) {
	if (typeof window === 'undefined') {
		return httpBatchLink({
			url: 'localhost:3000/api/trpc',
			headers() {
				if (!ctx?.req?.headers) {
					return {}
				}
				return {
					...ctx.req.headers,
					'x-ssr': '1',
				}
			},
		})
	}

	const client = createWSClient({
		url: 'ws://localhost:3001',
	})

	return wsLink<AppRouter>({
		client,
	})
}

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */

		return {
			/**
			 * @link https://trpc.io/docs/client/links
			 */
			links: [
				// adds pretty logs to your console in development and logs errors in production
				loggerLink({
					enabled: (opts) =>
						(process.env.NODE_ENV === 'development' &&
							typeof window !== 'undefined') ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				getEndingLink(ctx),
			],
			/**
			 * @link https://trpc.io/docs/data-transformers
			 */
			transformer: superjson,
			/**
			 * @link https://tanstack.com/query/v4/docs/react/reference/QueryClient
			 */
			queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		}
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: true,
})

/**
 * Enum containing all api query paths
 */
export type TQuery = keyof AppRouter['_def']['queries']
/**
 * Enum containing all api mutation paths
 */
export type TMutation = keyof AppRouter['_def']['mutations']
/**
 * Enum containing all api subscription paths
 */
export type TSubscription = keyof AppRouter['_def']['subscriptions']
/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
	AppRouter['_def']['queries'][TRouteKey]
>
/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
	AppRouter['_def']['queries'][TRouteKey]
>
/**
 * This is a helper method to infer the output of a mutation resolver
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferMutationOutput<TRouteKey extends TMutation> =
	inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>
/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> =
	inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>
/**
 * This is a helper method to infer the output of a subscription resolver
 * @example type HelloOutput = InferSubscriptionOutput<'hello'>
 */
export type InferSubscriptionOutput<TRouteKey extends TSubscription> =
	inferProcedureOutput<AppRouter['_def']['subscriptions'][TRouteKey]>
/**
 * This is a helper method to infer the asynchronous output of a subscription resolver
 * @example type HelloAsyncOutput = InferAsyncSubscriptionOutput<'hello'>
 */
export type InferAsyncSubscriptionOutput<TRouteKey extends TSubscription> =
	inferSubscriptionOutput<AppRouter, TRouteKey>
/**
 * This is a helper method to infer the input of a subscription resolver
 * @example type HelloInput = InferSubscriptionInput<'hello'>
 */
export type InferSubscriptionInput<TRouteKey extends TSubscription> =
	inferProcedureInput<AppRouter['_def']['subscriptions'][TRouteKey]>
