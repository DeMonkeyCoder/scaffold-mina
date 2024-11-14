import { defineChain } from '../../utils/chain/defineChain'

export const taraxaTestnet = /*#__PURE__*/ defineChain({
  id: 842,
  name: 'Taraxa Testnet',
  nativeCurrency: { name: 'Tara', symbol: 'TARA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.taraxa.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Taraxa Explorer',
      url: 'https://explorer.testnet.taraxa.io',
    },
  },
  testnet: true,
})
