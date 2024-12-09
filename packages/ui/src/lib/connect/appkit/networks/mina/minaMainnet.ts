import {defineChain} from '../utils'

// @ts-ignore
export const minaMainnet = defineChain({
    id: "mina:mainnet",
    name: "Mina Mainnet",
    network: 'mina:mainnet',
    nativeCurrency: {name: "MINA", symbol: "MINA", decimals: 9},
    rpcUrls: {
        default: {
            http: ["https://mainnet.klesia.palladians.xyz/api"],
        },
    },
    blockExplorers: {
        default: {
            name: "Minascan",
            url: "https://minascan.io/mainnet",
        },
    },
    testnet: false,
    // @ts-ignore
    chainNamespace: 'mina',
    // @ts-ignore
    caipNetworkId: 'mina:mainnet',
    deprecatedCaipNetworkId: 'mina:mainnet'
})
