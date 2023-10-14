import type { AppType } from 'next/app'
import { trpc } from '../utils/trpc'

import '../styles/globals.css'

import { PrimeReactProvider } from 'primereact/api'
import '~/styles/prime-theme.css'

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<PrimeReactProvider>
			<Component {...pageProps} />
		</PrimeReactProvider>
	)
}
export default trpc.withTRPC(MyApp)
