import type {
  CaipNetworkId,
  ChainNamespace,
} from '@reown/appkit-common/dist/types/src/utils/TypeUtil'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks'

export const minaMainnet: AppKitNetwork = defineChain({
  id: 'mina:mainnet',
  name: 'Mina Mainnet',
  network: 'mina:mainnet',
  nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.klesia.palladians.xyz/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Minascan',
      url: 'https://minascan.io/mainnet',
    },
  },
  testnet: false,
  chainNamespace: 'mina' as ChainNamespace,
  caipNetworkId: 'mina:mainnet' as CaipNetworkId,
  deprecatedCaipNetworkId: 'mina:mainnet',
  graphqlEndpoint: 'https://api.minascan.io/node/mainnet/v1/graphql',
})
