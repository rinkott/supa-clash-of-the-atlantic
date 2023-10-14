import React, { Children } from 'react'
import clsx from 'clsx'

function Header(props: { children?: React.ReactNode; isDark?: boolean }) {
	return (
		<section className="relative w-full h-[152px]">
			<div
				className={clsx(
					props.isDark ? 'bg-continents-bar-dark' : 'bg-continents-bar',
					'absolute inset-0 opacity-70 bg-no-repeat bg-cover'
				)}
			></div>
			<div className="absolute inset-0 flex items-center justify-center font-druk text-8xl outline-text-l text-transparent tabular-nums tracking-wider">
				{props.children}
			</div>
		</section>
	)
}

export default Header
