import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { BridgeContractAddresses } from '../types/contract'
import type { PublicZksyncRpcSchema } from '../types/eip1193'

export type GetDefaultBridgeAddressesReturnType = BridgeContractAddresses

export async function getDefaultBridgeAddresses<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>,
): Promise<GetDefaultBridgeAddressesReturnType> {
  const addresses = await client.request({ method: 'zks_getBridgeContracts' })
  return {
    erc20L1: addresses.l1Erc20DefaultBridge,
    sharedL1: addresses.l1SharedDefaultBridge,
    sharedL2: addresses.l2SharedDefaultBridge,
  }
}
