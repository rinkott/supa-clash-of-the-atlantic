import React, { ReactNode, useRef, useState } from 'react'

import { trpc } from '~/utils/trpc'
import { Team } from '~/utils/signups'
import { Card } from 'primereact/card'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'

function Controls() {
	const addMutate = trpc.caster.add.useMutation()
	const removeMutate = trpc.caster.remove.useMutation()

	const setCountdownMutate = trpc.countdown.set.useMutation()

	const setPointsMutate = trpc.match.setPoints.useMutation()

	const setRosterMutate = trpc.match.setRoster.useMutation()

	async function addCaster() {
		await addMutate.mutateAsync({
			discordId: '12345',
			name: 'Magician',
		})
	}

	async function removeCaster() {
		await removeMutate.mutateAsync('123')
	}

	const [countdownMinutes, setCountdownMinutes] = useState(15)

	async function setCountdown() {
		await setCountdownMutate.mutateAsync(countdownMinutes * 60)
	}

	async function setPoints(team: Team, points: number) {
		await setPointsMutate.mutateAsync({
			team,
			points,
		})
	}

	async function setRoster(team: Team, roster: string[]) {
		await setRosterMutate.mutateAsync({
			team,
			roster,
		})
	}

	const [euPoints, setEuPoints] = useState(0)
	const [naPoints, setNaPoints] = useState(0)

	const toast = useRef<Toast>(null)

	const [euRosterRaw, setEuRosterRaw] = useState('')
	const [naRosterRaw, setNaRosterRaw] = useState('')

	const show = (text: string) => {
		toast.current!.show({
			severity: 'info',
			summary: 'Info',
			detail: text,
		})
	}

	return (
		<section className="grid grid-cols-2 gap-10 w-2/3 p-10">
			<Toast ref={toast} />

			<Card title="Countdown">
				<div className="flex gap-5">
					<InputNumber
						value={countdownMinutes}
						onValueChange={(e) => {
							setCountdownMinutes(e.value!)
						}}
						max={60}
						min={0}
						step={1}
						suffix=" minutes"
					/>

					<Button
						onClick={async () => {
							await setCountdown()

							show('Countdown updated')
						}}
					>
						Set countdown
					</Button>
				</div>
			</Card>

			<Card title="Points">
				<div className="flex gap-5 mb-4">
					<InputNumber
						value={euPoints}
						onValueChange={(e) => {
							setEuPoints(e.value!)
						}}
						max={60}
						min={0}
						step={1}
						placeholder="EU points"
						showButtons
						buttonLayout="horizontal"
					/>

					<Button
						onClick={async () => {
							await setPoints('EU', euPoints)

							show('EU points updated')
						}}
					>
						Set EU points
					</Button>
				</div>

				<div className="flex gap-5">
					<InputNumber
						value={naPoints}
						onValueChange={(e) => {
							setNaPoints(e.value!)
						}}
						max={60}
						min={0}
						step={1}
						placeholder="NA points"
						showButtons
						buttonLayout="horizontal"
					/>

					<Button
						onClick={async () => {
							await setPoints('NA', naPoints)

							show('NA points updated')
						}}
					>
						Set NA points
					</Button>
				</div>
			</Card>

			<Card
				title={
					<>
						<h1 className="mb-0">Rosters</h1>
						<sub className="text-sm font-medium">
							Input player ids separated with {'","'}<br></br>
						</sub>
					</>
				}
			>
				<div className="flex w-full gap-5 mb-4">
					<InputTextarea
						value={euRosterRaw}
						onChange={(e) => {
							setEuRosterRaw(e.target.value!)
						}}
						placeholder="EU Roster"
						className="w-[300px]"
					/>

					<Button
						onClick={async () => {
							const roster = euRosterRaw.split(',')

							await setRoster('EU', roster)

							show('EU roster updated')
						}}
					>
						Set EU roster
					</Button>
				</div>

				<div className="flex gap-5">
					<InputTextarea
						value={naRosterRaw}
						onChange={(e) => {
							setNaRosterRaw(e.target.value!)
						}}
						placeholder="NA Roster"
						className="w-[300px]"
					/>

					<Button
						onClick={async () => {
							const roster = naRosterRaw.split(',')

							await setRoster('NA', roster)

							show('NA roster updated')
						}}
					>
						Set NA roster
					</Button>
				</div>
			</Card>
		</section>
	)
}

export default Controls
