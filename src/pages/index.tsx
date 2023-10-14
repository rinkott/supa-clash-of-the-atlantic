import { trpc } from '../utils/trpc'

export default function IndexPage() {
	const result = trpc.healthcheck.useQuery()

	if (!result.data) {
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		)
	}
	return (
		<div>
			<h1>{result.data}</h1>
		</div>
	)
}