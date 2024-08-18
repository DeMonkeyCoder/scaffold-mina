import { ChainInfoArgs } from "@aurowallet/mina-provider";

export const NETWORK_ID = "mina:testnet";

export function isSupportedNetwork(network: ChainInfoArgs | null) {
  return network?.networkID === NETWORK_ID;
}
