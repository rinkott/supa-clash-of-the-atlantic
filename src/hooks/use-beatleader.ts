import { useEffect, useRef, useState } from 'react'
import wretch from 'wretch'

import { useApiResult } from './use-api'

export interface IBeatLeaderUser {
    id: string
    name: string
    platform: string
    avatar: string
    country: string
    pp: number
    rank: number
    countryRank: number
    role: string

    clans: {
        id: number
        tag: string
        color: string
    }[]
}

const BASE_URL = 'https://api.beatleader.xyz'
const client = wretch(BASE_URL)

export const useBeatLeaderPlayer = (id: string | null) => {
	const { result: player } = useApiResult<IBeatLeaderUser>(
		client,
		`/player/${id}`,
		!id
	)

	return { player }
}
