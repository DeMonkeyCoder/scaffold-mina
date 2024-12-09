import type {AppKitNetwork} from "@reown/appkit/networks";
import {defineChain} from '@reown/appkit/networks'
import {CaipNetworkId, ChainNamespace} from "@reown/appkit-common/dist/types/src/utils/TypeUtil";

export const minaMainnet: AppKitNetwork = defineChain({
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
    chainNamespace: 'mina' as ChainNamespace,
    caipNetworkId: 'mina:mainnet' as CaipNetworkId,
    deprecatedCaipNetworkId: 'mina:mainnet'
})
