import {defineChain} from '../utils'

// @ts-ignore
export const minaDevnet = defineChain({
    id: "mina:devnet",
    name: "Mina Devnet",
    network: 'mina:devnet',
    nativeCurrency: {name: "MINA", symbol: "MINA", decimals: 9},
    rpcUrls: {
        default: {
            http: ["https://devnet.klesia.palladians.xyz/api"],
        },
    },
    blockExplorers: {
        default: {
            name: "Minascan",
            url: "https://minascan.io/devnet",
        },
    },
    testnet: true,
    // @ts-ignore
    chainNamespace: 'mina',
    // @ts-ignore
    caipNetworkId: 'mina:mainnet',
    deprecatedCaipNetworkId: 'mina:mainnet'
})
