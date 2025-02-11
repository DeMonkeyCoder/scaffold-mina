import type {
  Account,
  Chain,
  Client,
  SignTransactionErrorType as viem_SignTransactionErrorType,
  SignTransactionParameters as viem_SignTransactionParameters,
  SignTransactionReturnType as viem_SignTransactionReturnType,
  TransactionType,
} from '@/lib/connect/viem'
import {signTransaction as viem_signTransaction} from '@/lib/connect/viem/actions'

import type {Config} from '../createConfig'
import type {BaseErrorType, ErrorType} from '../errors/base'
import type {SelectChains} from '../types/chain'
import type {ConnectorParameter, NetworkIdParameter,} from '../types/properties'
import type {Compute} from '../types/utils'
import {getAction} from '../utils/getAction'
import {getConnectorClient, type GetConnectorClientErrorType,} from './getConnectorClient'

export type SignTransactionParameters<
  transactionType extends TransactionType,
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>,
> = {
  [key in keyof chains]: Compute<
    viem_SignTransactionParameters<
      transactionType,
      chains[key],
      Account,
      chains[key]
    > &
      NetworkIdParameter<config, networkId> &
      ConnectorParameter
  >
}[number]

export type SignTransactionReturnType<transactionType extends TransactionType> =
  viem_SignTransactionReturnType<transactionType>

export type SignTransactionErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // viem
  | viem_SignTransactionErrorType

/** https://wagmi.sh/core/api/actions/signTransaction */
export async function signTransaction<
  config extends Config,
  networkId extends config['chains'][number]['id'],
  parameters extends SignTransactionParameters<
    TransactionType,
    config,
    networkId
  > = SignTransactionParameters<TransactionType, config, networkId>,
>(
  config: config,
  parameters: parameters,
): Promise<SignTransactionReturnType<parameters['type']>> {
  const { account, networkId, connector, ...rest } = parameters

  let client: Client
  if (typeof account === 'object' && account?.type === 'local')
    client = config.getClient({ networkId })
  else
    client = await getConnectorClient(config, {
      account: account ?? undefined,
      networkId,
      connector,
    })

  // @ts-ignore
  const action = getAction(client, viem_signTransaction, 'signTransaction')
  return action({
    ...(rest as any),
    ...(account ? { account } : {}),
    chain: networkId ? { id: networkId } : null,
    // gas: rest.gas ?? undefined,
  }) as SignTransactionReturnType<parameters['type']>
}
