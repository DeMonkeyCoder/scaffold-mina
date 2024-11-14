import { defineChain } from '../../utils/chain/defineChain'

export const nautilus = /*#__PURE__*/ defineChain({
  id: 22222,
  name: 'Nautilus Mainnet',
  nativeCurrency: { name: 'ZBC', symbol: 'ZBC', decimals: 9 },
  rpcUrls: {
    default: {
      http: ['https://api.nautilus.nautchain.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'NautScan',
      url: 'https://nautscan.com',
    },
  },
})
