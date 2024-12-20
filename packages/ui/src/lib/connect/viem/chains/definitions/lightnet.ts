import { defineChain } from '../../utils/chain/defineChain'

export const lightnet = /*#__PURE__*/ defineChain({
  id: 'mina:devnet-lightnet',
  name: 'Mina Lightnet',
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
  graphqlEndpoint: 'http://127.0.0.1:8080/graphql',
})
