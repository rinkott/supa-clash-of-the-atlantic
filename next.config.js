/** @type {import("next").NextConfig} */
module.exports = {
	/** We run eslint as a separate task in CI */
	eslint: { ignoreDuringBuilds: !!process.env.CI },

	webpack(config) {
		const fileLoaderRule = config.module.rules.find((rule) =>
			rule.test?.test?.('.svg')
		)

		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/,
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				resourceQuery: { not: /url/ },
				use: ['@svgr/webpack'],
			}
		)

		fileLoaderRule.exclude = /\.svg$/i

		return config
	},
}
