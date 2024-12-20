import { defineChain } from '../../utils/chain/defineChain'

export const devnet = /*#__PURE__*/ defineChain({
  id: 'mina:devnet',
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
  graphqlEndpoint: 'https://api.minascan.io/node/devnet/v1/graphql',
})
