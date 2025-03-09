import type {
  CaipNetworkId,
  ChainNamespace,
} from '@reown/appkit-common/dist/types/src/utils/TypeUtil'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks'
import { devnet } from 'vimina/chains'

export const minaDevnet: AppKitNetwork & {
  id: string
} = defineChain({
  id: devnet.id,
  name: 'Mina Devnet',
  nativeCurrency: devnet.nativeCurrency,
  rpcUrls: devnet.rpcUrls,
  blockExplorers: devnet.blockExplorers,
  graphqlEndpoint: devnet.graphqlEndpoint,
  testnet: true,
  chainNamespace: 'mina' as ChainNamespace,
  caipNetworkId: 'mina:devnet' as CaipNetworkId,
  deprecatedCaipNetworkId: 'mina:devnet',
})
