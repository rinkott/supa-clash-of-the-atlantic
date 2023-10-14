import { useState } from 'react'
import { trpc } from '../utils/trpc'

function Subscription() {
	const [number, setNumber] = useState(0)

	trpc.randomNumber.useSubscription(undefined, {
		onData(data) {
			setNumber(data)
		},
	})

	return <div>{number}</div>
}

export default Subscription
