import { defineChain } from "../../utils/chain/defineChain";

export const devnet = /*#__PURE__*/ defineChain({
  id: "mina:devnet",
  name: "Mina Devnet",
  nativeCurrency: { name: "MINA", symbol: "MINA", decimals: 9 },
  rpcUrls: {
    default: {
      http: ["https://cloudflare-eth.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
      apiUrl: "https://api.etherscan.io/api",
    },
  },
});
