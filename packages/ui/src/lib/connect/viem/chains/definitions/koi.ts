import { defineChain } from "../../utils/chain/defineChain";

export const koi = defineChain({
  id: 701,
  name: "Koi Network",
  nativeCurrency: {
    decimals: 18,
    name: "Koi Network Native Token",
    symbol: "KRING",
  },
  rpcUrls: {
    default: {
      http: ["https://koi-rpc.darwinia.network"],
      webSocket: ["wss://koi-rpc.darwinia.networkID"],
    },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://koi-scan.darwinia.network" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 180001,
    },
  },
  testnet: true,
});
