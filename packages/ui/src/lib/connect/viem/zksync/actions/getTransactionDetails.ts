import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { Hash } from '../../types/misc'
import type { PublicZksyncRpcSchema } from '../types/eip1193'
import type { ZksyncTransactionDetails } from '../types/transaction'

export type GetTransactionDetailsParameters = {
  txHash: Hash
}

export type GetTransactionDetailsReturnType = ZksyncTransactionDetails

export async function getTransactionDetails<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>,
  parameters: GetTransactionDetailsParameters,
): Promise<GetTransactionDetailsReturnType> {
  const result = await client.request({
    method: 'zks_getTransactionDetails',
    params: [parameters.txHash],
  })
  return result
}
