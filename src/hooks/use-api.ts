import { useEffect, useRef, useState } from 'react'
import wretch, { Wretch } from 'wretch'

export const useApiResult = <T>(
	client: Wretch,
	url: string,
	skip: boolean
): { result: T | null } => {
	const [result, setResult] = useState<T | null>(null)

	useEffect(() => {
		if (skip) return

		const update = async () => {
			try {
				const data = await client.get(url).json<T>()

				setResult(data)
			} catch (err) {
				console.error(`Failed fetch at ${client._url}:${url}`)

				setResult(null)
			}
		}

		update()
	}, [skip, url])

	return { result }
}
