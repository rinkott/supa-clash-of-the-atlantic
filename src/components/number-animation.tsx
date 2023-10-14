import React, { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'

const NumberAnimation = (props: {
    value: number,
    duration?: number,

	formatter?: (n: number) => string | number,

	className?: string
}) => {
	const [currentValue, setCurrentValue] = useState(props.value)

	const formatter = props.formatter || ((n: number) => Math.floor(n))

	useEffect(() => {
		setCurrentValue(props.value)
	}, [props.value])

	const { number } = useSpring({
		number: currentValue,
		from: { number: 0 },
		config: { duration: props.duration || 1000 },
	})

	return (
		<animated.span className={props.className}>
			{number.to(formatter)}
		</animated.span>
	)
}

export default NumberAnimation