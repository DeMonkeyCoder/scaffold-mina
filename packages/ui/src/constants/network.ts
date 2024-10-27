//TODO: change this to mina:devnet
export const NETWORK_ID = "mina:testnet";

//TODO: fix this after implementing switchNetwork
export function isSupportedNetwork(networkID: string | null) {
  return true;
  // return networkID === NETWORK_ID;
}
