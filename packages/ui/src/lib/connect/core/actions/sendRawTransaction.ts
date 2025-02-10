import type {
  SendRawTransactionErrorType as viem_SendRawTransactionErrorType,
  SendRawTransactionParameters as viem_SendRawTransactionParameters,
  SendRawTransactionReturnType as viem_SendRawTransactionReturnType,
} from '@/lib/connect/viem'
import {sendRawTransaction as viem_sendRawTransaction} from '@/lib/connect/viem/actions'

import type {Config} from '../createConfig'
import type {BaseErrorType, ErrorType} from '../errors/base'
import type {NetworkIdParameter,} from '../types/properties'
import type {Compute} from '../types/utils'
import {getAction} from '../utils/getAction'
import type {GetConnectorClientErrorType} from './getConnectorClient'

export type SendRawTransactionParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<
  viem_SendRawTransactionParameters & NetworkIdParameter<config, networkId>
>

export type SendRawTransactionReturnType = viem_SendRawTransactionReturnType

export type SendRawTransactionErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // viem
  | viem_SendRawTransactionErrorType

/** https://wagmi.sh/core/api/actions/sendRawTransaction */
export async function sendRawTransaction<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  { networkId, ...rest }: SendRawTransactionParameters<config, networkId>,
): Promise<SendRawTransactionReturnType> {
  const client = config.getClient({ networkId })
  const action = getAction(
    client,
    // @ts-ignore
    viem_sendRawTransaction,
    'sendRawTransaction',
  )
  const hash = await action({
    ...(rest as any),
  })

  // return hash
  return hash as SendRawTransactionReturnType
}
