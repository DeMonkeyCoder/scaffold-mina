import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type {
  ZksyncBlockDetails,
  ZksyncNumberParameter,
} from '../types/block'
import type { PublicZksyncRpcSchema } from '../types/eip1193'

export type GetBlockDetailsParameters = ZksyncNumberParameter

export type GetBlockDetailsReturnType = ZksyncBlockDetails

export async function getBlockDetails<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>,
  parameters: GetBlockDetailsParameters,
): Promise<GetBlockDetailsReturnType> {
  const result = await client.request({
    method: 'zks_getBlockDetails',
    params: [parameters.number],
  })
  return result
}
