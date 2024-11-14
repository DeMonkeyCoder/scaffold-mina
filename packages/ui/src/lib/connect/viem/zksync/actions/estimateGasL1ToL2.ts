import { parseAccount } from '../../accounts/utils/parseAccount'
import type { SendTransactionParameters } from '../../actions/wallet/sendTransaction'
import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { Account } from '../../types/account'
import type { ChainEIP712 } from '../types/chain'
import type { PublicZksyncRpcSchema } from '../types/eip1193'

export type EstimateGasL1ToL2Parameters<
  chain extends ChainEIP712 | undefined = ChainEIP712 | undefined,
  account extends Account | undefined = Account | undefined,
> = SendTransactionParameters<chain, account>

export type EstimateGasL1ToL2ReturnType = bigint

export async function estimateGasL1ToL2<
  chain extends ChainEIP712 | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>,
  parameters: EstimateGasL1ToL2Parameters<chain, account>,
): Promise<EstimateGasL1ToL2ReturnType> {
  const { account: account_, ...request } = parameters
  const account = account_ ? parseAccount(account_) : client.account

  const formatters = client.chain?.formatters
  const formatted = formatters?.transactionRequest?.format({
    ...request,
    from: account?.address,
  })

  const result = await client.request({
    method: 'zks_estimateGasL1ToL2',
    params: [formatted],
  })

  return result
}
