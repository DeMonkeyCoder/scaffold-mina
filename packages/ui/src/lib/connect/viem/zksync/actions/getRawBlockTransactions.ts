import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { ZksyncNumberParameter } from '../types/block'
import type { PublicZksyncRpcSchema } from '../types/eip1193'
import type { ZksyncRawBlockTransactions } from '../types/transaction'
import { camelCaseKeys } from '../utils/camelCaseKeys'

export type GetRawBlockTransactionsParameters = ZksyncNumberParameter

export type GetRawBlockTransactionsReturnType = ZksyncRawBlockTransactions

export async function getRawBlockTransactions<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>,
  parameters: GetRawBlockTransactionsParameters,
): Promise<GetRawBlockTransactionsReturnType> {
  const result = await client.request({
    method: 'zks_getRawBlockTransactions',
    params: [parameters.number],
  })
  return camelCaseKeys(result) as GetRawBlockTransactionsReturnType
}
