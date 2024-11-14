import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { Hex } from '../../types/misc'
import type { PublicZksyncRpcSchema } from '../types/eip1193'

export type GetL1ChainIdReturnType = Hex

export async function getL1ChainId<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>,
): Promise<GetL1ChainIdReturnType> {
  const result = await client.request({ method: 'zks_L1ChainId' })
  return result
}
