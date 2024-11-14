import { defineChain } from "../../utils/chain/defineChain";

export const reyaNetwork = /*#__PURE__*/ defineChain({
  id: 1729,
  name: "Reya Network",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: {
    default: {
      http: ["https://rpc.reya.network"],
      webSocket: ["wss://ws.reya.networkID"],
    },
  },
  blockExplorers: {
    default: {
      name: "Reya Network Explorer",
      url: "https://explorer.reya.network",
    },
  },
  testnet: false,
});
