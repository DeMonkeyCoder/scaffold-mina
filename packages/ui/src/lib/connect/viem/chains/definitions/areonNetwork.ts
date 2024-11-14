import { defineChain } from "../../utils/chain/defineChain";

export const areonNetwork = /*#__PURE__*/ defineChain({
  id: 463,
  name: "Areon Network",
  nativeCurrency: { decimals: 18, name: "AREA", symbol: "AREA" },
  rpcUrls: {
    default: {
      http: ["https://mainnet-rpc.areon.network"],
      webSocket: ["wss://mainnet-ws.areon.networkID"],
    },
  },
  blockExplorers: {
    default: {
      name: "Areonscan",
      url: "https://areonscan.com",
    },
  },
  testnet: false,
});
