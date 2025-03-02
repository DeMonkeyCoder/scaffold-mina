import type {
  CaipNetworkId,
  ChainNamespace,
} from '@reown/appkit-common/dist/types/src/utils/TypeUtil'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks'

export const minaDevnet: AppKitNetwork & {
  id: string
} = defineChain({
  id: 'devnet',
  name: 'Mina Devnet',
  nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
  rpcUrls: {
    default: {
      http: ['https://devnet.klesia.palladians.xyz/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Minascan',
      url: 'https://minascan.io/devnet',
    },
  },
  testnet: true,
  chainNamespace: 'mina' as ChainNamespace,
  caipNetworkId: 'mina:devnet' as CaipNetworkId,
  deprecatedCaipNetworkId: 'mina:devnet',
  graphqlEndpoint: 'https://api.minascan.io/node/devnet/v1/graphql',
})
