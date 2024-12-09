import {WagmiAdapter} from '@/lib/connect/adapter/src'
import type {AppKitNetwork} from '@reown/appkit/networks'
import {devnet, mainnet, minaDevnet} from "@/lib/connect/appkit/networks";
import {http} from "@/lib/connect/viem";
import {Mina} from "o1js";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const metadata = {
    name: 'Scaffold Mina',
    description: 'Scaffold Mina',
    url: 'https://scaffold-mina.on-fleek.app/',
}

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [minaDevnet, minaDevnet] as [AppKitNetwork, ...AppKitNetwork[]]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks,
    connectors: [],
    storage: null,
    pollingInterval: 10_000,
    transports: {
        [mainnet.id]: http(),
        [devnet.id]: http(),
    },
    minaActiveInstance: Mina.Network(
        "https://api.minascan.io/node/devnet/v1/graphql"
    ),
})

export const config = wagmiAdapter.wagmiConfig