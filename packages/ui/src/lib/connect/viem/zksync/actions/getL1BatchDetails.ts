import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type {
  ZksyncBatchDetails,
  ZksyncNumberParameter,
} from '../types/block'
import type { PublicZksyncRpcSchema } from '../types/eip1193'

export type GetL1BatchDetailsParameters = ZksyncNumberParameter

export type GetL1BatchDetailsReturnType = ZksyncBatchDetails

export async function getL1BatchDetails<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>,
  parameters: GetL1BatchDetailsParameters,
): Promise<GetL1BatchDetailsReturnType> {
  const result = await client.request({
    method: 'zks_getL1BatchDetails',
    params: [parameters.number],
  })
  return result
}
