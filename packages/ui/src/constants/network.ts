//TODO: change this to mina:devnet
export const NETWORK_ID = "mina:devnet";

//TODO: fix this after implementing switchNetwork
export function isSupportedNetwork(networkID: string | null) {
  return networkID === NETWORK_ID;
}
