//TODO: change this to mina:devnet
import { CaipNetwork } from '@reown/appkit-common'

export const NETWORK_ID = 'mina:devnet'

//TODO: fix this after implementing switchNetwork
export function isSupportedNetwork(networkId: CaipNetwork['id'] | undefined) {
  return networkId === NETWORK_ID
}
