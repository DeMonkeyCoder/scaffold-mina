import type {
  SendSignedTransactionErrorType as viem_SendSignedTransactionErrorType,
  SendSignedTransactionParameters as viem_SendSignedTransactionParameters,
  SendSignedTransactionReturnType as viem_SendSignedTransactionReturnType,
} from 'vimina'
import { sendSignedTransaction as viem_sendSignedTransaction } from 'vimina/actions'

import type { Config } from '../createConfig'
import type { BaseErrorType, ErrorType } from '../errors/base'
import type { NetworkIdParameter } from '../types/properties'
import type { Compute } from '../types/utils'
import { getAction } from '../utils/getAction'
import type { GetConnectorClientErrorType } from './getConnectorClient'

export type SendSignedTransactionParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<
  viem_SendSignedTransactionParameters & NetworkIdParameter<config, networkId>
>

export type SendSignedTransactionReturnType =
  viem_SendSignedTransactionReturnType

export type SendSignedTransactionErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // viem
  | viem_SendSignedTransactionErrorType

/** https://wagmi.sh/core/api/actions/sendSignedTransaction */
export async function sendSignedTransaction<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  { networkId, ...rest }: SendSignedTransactionParameters<config, networkId>,
): Promise<SendSignedTransactionReturnType> {
  const client = config.getClient({ networkId })
  const action = getAction(
    client,
    // @ts-ignore
    viem_sendSignedTransaction,
    'sendSignedTransaction',
  )
  const hash = await action({
    ...(rest as any),
  })

  // return hash
  return hash as SendSignedTransactionReturnType
}
