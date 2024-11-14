import { chainConfig } from '../../op-stack/chainConfig'
import { defineChain } from '../../utils/chain/defineChain'

export const dchainTestnet = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 2713017997578000,
  name: 'Dchain Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://dchaintestnet-2713017997578000-1onrpc.testnet.sagarpc.io',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Dchain Explorer',
      url: 'https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io',
      apiUrl:
        'https://api-dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io/api',
    },
  },
  contracts: {
    ...chainConfig.contracts,
  },
})
