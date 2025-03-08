import type {
  Account,
  Chain,
  Client,
  SendTransactionErrorType as viem_SendTransactionErrorType,
  SendTransactionParameters as viem_SendTransactionParameters,
  SendTransactionReturnType as viem_SendTransactionReturnType,
} from 'vimina'
import { sendTransaction as viem_sendTransaction } from 'vimina/actions'

import type { Config } from '../createConfig'
import type { BaseErrorType, ErrorType } from '../errors/base'
import type { SelectChains } from '../types/chain'
import type {
  ConnectorParameter,
  NetworkIdParameter,
} from '../types/properties'
import type { Compute } from '../types/utils'
import { getAction } from '../utils/getAction'
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from './getConnectorClient'

export type SendTransactionParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>,
> = Compute<
  {
    [key in keyof chains]: Compute<
      viem_SendTransactionParameters<chains[key], Account, chains[key]> &
        NetworkIdParameter<config, networkId> &
        ConnectorParameter
    >
  }[number]
>

export type SendTransactionReturnType = viem_SendTransactionReturnType

export type SendTransactionErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // viem
  | viem_SendTransactionErrorType

/** https://wagmi.sh/core/api/actions/sendTransaction */
export async function sendTransaction<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: SendTransactionParameters<config, networkId>,
): Promise<SendTransactionReturnType> {
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
  const action = getAction(client, viem_sendTransaction, 'sendTransaction')
  const hash = await action({
    ...(rest as any),
    ...(account ? { account } : {}),
    chain: networkId ? { id: networkId } : null,
    // gas: rest.gas ?? undefined,
  })

  // return hash
  return hash as SendTransactionReturnType
}
