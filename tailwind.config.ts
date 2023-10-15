import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		keyframes: {
			'accordion-down': {
				from: { height: '0px' },
				to: { height: 'var(--radix-accordion-content-height)' },
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: '0px' },
			},
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
		},
		extend: {
			backgroundImage: {
				'continents-bar': 'url(../public/continents.png)',
				'footer-bar': 'url(../public/footer-bar.png)',
				'continents-bar-dark': 'url(../public/continents-overlay.png)',
				dots: 'url(../public/dots.png)',
			},

			fontFamily: {
				sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
				poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
				druk: ['"Druk Wide"', ...defaultTheme.fontFamily.sans],
			},

			colors: {
			},

			// boxShadow: {
			// 	'mvp': ''
			// }
		},
	},

	darkMode: 'class',

	plugins: [require('tailwindcss-animate')],
} satisfies Config
