import { defineChain } from '../../utils/chain/defineChain'

export const bearNetworkChainTestnet = /*#__PURE__*/ defineChain({
  id: 751230,
  name: 'Bear Network Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tBRNKC',
    symbol: 'tBRNKC',
  },
  rpcUrls: {
    default: { http: ['https://brnkc-test.bearnetwork.net'] },
  },
  blockExplorers: {
    default: {
      name: 'BrnkTestScan',
      url: 'https://brnktest-scan.bearnetwork.net',
      apiUrl: 'https://brnktest-scan.bearnetwork.net/api',
    },
  },
  testnet: true,
})
