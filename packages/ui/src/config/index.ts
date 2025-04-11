import { WagminaAdapter, type WagminaAppKitNetwork } from '@wagmina/appkit'
import { minaDevnet, minaLightnet, minaMainnet } from '@wagmina/appkit/networks'
import { http, klesia } from 'vimina'
// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
  name: 'Scaffold Mina',
  description: 'Scaffold Mina',
  url: 'https://scaffold-mina.on-fleek.app/',
  icons: [],
}

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [minaDevnet, minaMainnet, minaLightnet] as [
  WagminaAppKitNetwork,
  ...WagminaAppKitNetwork[],
]

//Set up the Wagmina Adapter (Config)
export const wagminaAdapter = new WagminaAdapter({
  projectId,
  networks,
  transports: {
    [minaMainnet.id]: klesia(),
    [minaDevnet.id]: klesia(),
    [minaLightnet.id]: http(),
  },
})

export const config = wagminaAdapter.wagminaConfig
