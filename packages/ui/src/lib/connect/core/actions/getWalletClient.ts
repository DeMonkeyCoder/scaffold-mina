import { type Account, type WalletClient, walletActions } from 'vimina'

import type { Config } from '../createConfig'
import type { BaseErrorType, ErrorType } from '../errors/base'
import type { Compute } from '../types/utils'
import {
  type GetConnectorClientErrorType,
  type GetConnectorClientParameters,
  getConnectorClient,
} from './getConnectorClient'

export type GetWalletClientParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = GetConnectorClientParameters<Config, networkId>

export type GetWalletClientReturnType<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<
  WalletClient<
    config['_internal']['transports'][networkId],
    Extract<config['chains'][number], { id: networkId }>,
    Account
  >
>

export type GetWalletClientErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType

export async function getWalletClient<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: GetWalletClientParameters<config, networkId> = {},
): Promise<GetWalletClientReturnType<config, networkId>> {
  const client = await getConnectorClient(config, parameters)
  client.extend(walletActions)

  // @ts-ignore
  return client.extend(walletActions) as unknown as GetWalletClientReturnType<
    config,
    networkId
  >
}
