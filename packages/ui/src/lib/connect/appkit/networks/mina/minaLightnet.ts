import type {
  CaipNetworkId,
  ChainNamespace,
} from '@reown/appkit-common/dist/types/src/utils/TypeUtil'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks'

export const minaLightnet: AppKitNetwork = defineChain({
  id: 'mina:devnet-lightnet',
  name: 'Mina Lightnet',
  network: 'mina:devnet-lightnet',
  nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
  rpcUrls: {
    default: {
      http: ['https://devnet.klesia.palladians.xyz/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Minascan',
      url: 'https://minascan.io/lightnet',
    },
  },
  testnet: true,
  chainNamespace: 'mina' as ChainNamespace,
  caipNetworkId: 'mina:devnet-lightnet' as CaipNetworkId,
  deprecatedCaipNetworkId: 'mina:devnet-lightnet',
  graphqlEndpoint: 'http://127.0.0.1:8080/graphql',
})
