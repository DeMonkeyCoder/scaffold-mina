import { defineChain } from '../../utils/chain/defineChain'
import { chainConfig } from '../../zksync/chainConfig'

export const zksyncInMemoryNode = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 260,
  name: 'ZKsync InMemory Node',
  network: 'zksync-in-memory-node',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://localhost:8011'],
    },
  },
  testnet: true,
})
