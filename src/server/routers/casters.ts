import TypedEmitter from 'typed-emitter'
import { publicProcedure, router } from '../trpc'
import { observable } from '@trpc/server/observable'
import EventEmitter from 'events'

type Caster = { name: string; discordId: string }

export type VoiceActivity = {
	caster: Caster
	isSpeaking: boolean
}

type CasterEvents = {
	updateActiveCasters: (activeCasters: Caster[]) => void
	updateVoiceActivity: (voiceActivity: VoiceActivity) => void
}

const ee = new EventEmitter() as TypedEmitter<CasterEvents>

const currentlySpeaking = new Map<string, VoiceActivity>()

const currentCasters = new Map<string, Caster>([
	['123', { name: 'Test', discordId: '123' }],
	['456', { name: 'Test2', discordId: '456' }],
])

export const casterRouter = router({
	add: publicProcedure
		.input((i) => i as Caster)
		.mutation((i) => {
			const caster = i.input

			currentCasters.set(caster.discordId, caster)

			ee.emit('updateActiveCasters', Array.from(currentCasters.values()))

			return true
		}),

	remove: publicProcedure
		.input((i) => i as string)
		.mutation((i) => {
			const casterId = i.input

			currentCasters.delete(casterId)

			ee.emit('updateActiveCasters', Array.from(currentCasters.values()))

			return true
		}),

	updateVoiceActivity: publicProcedure
		.input((i) => i as VoiceActivity)
		.mutation((i) => {
			const voiceActivity = i.input

			currentlySpeaking.set(voiceActivity.caster.discordId, voiceActivity)

			ee.emit('updateVoiceActivity', voiceActivity)

			return true
		}),

	subscribeToCasters: publicProcedure
		.input(() => null)
		.subscription(() => {
			return observable<VoiceActivity[]>((emit) => {
				function broadcastCasters() {
					console.log(currentCasters)
					const casters = Array.from(currentCasters.values())

					const voiceActivity: VoiceActivity[] = []

					for (const caster of casters) {
						const va = currentlySpeaking.get(caster.discordId)

						voiceActivity.push({
							caster,
							isSpeaking: !!va,
						})
					}

					emit.next(voiceActivity)
				}

				console.log('TETSTSTTSTSTTSTTS')

				emit.next([])

				broadcastCasters()

				ee.on('updateVoiceActivity', broadcastCasters)
				ee.on('updateActiveCasters', broadcastCasters)

				return () => {
					ee.off('updateVoiceActivity', broadcastCasters)
					ee.off('updateActiveCasters', broadcastCasters)
				}
			})
		}),
})

export const casterEventEmitter = ee
