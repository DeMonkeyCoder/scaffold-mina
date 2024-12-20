import { WagmiAdapter } from '@/lib/connect/adapter/src'
import {
  minaDevnet,
  minaLightnet,
  minaMainnet,
} from '@/lib/connect/appkit/networks'
import { http } from '@/lib/connect/viem'
import type { AppKitNetwork } from '@reown/appkit/networks'

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
export const networks = [minaDevnet, minaLightnet, minaMainnet] as [
  AppKitNetwork,
  ...AppKitNetwork[],
]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  connectors: [],
  storage: null,
  pollingInterval: 10_000,
  transports: {
    [minaMainnet.id]: http(),
    [minaDevnet.id]: http(),
    [minaLightnet.id]: http(),
  },
})

export const config = wagmiAdapter.wagmiConfig
