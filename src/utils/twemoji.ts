/** Converts Alpha-2 (ISO 3166-1) country code to twitter flag emoji */
export const toTwemojiFlag = (countryCode: string) =>
	`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${countryCode
		.toLowerCase()
		.match(/[a-z]/g)!
		.map((i: string) => (i.codePointAt(0)! + 127365).toString(16))
		.join('-')}.png`
