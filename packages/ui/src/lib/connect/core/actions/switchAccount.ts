import type { Address } from 'vimina'

import type { Config, Connector } from '../createConfig'
import type { BaseError, ErrorType } from '../errors/base'
import {
  ConnectorNotConnectedError,
  type ConnectorNotConnectedErrorType,
} from '../errors/config'

export type SwitchAccountParameters = {
  connector: Connector
}

export type SwitchAccountReturnType<config extends Config = Config> = {
  accounts: readonly [Address, ...Address[]]
  networkId:
    | config['chains'][number]['id']
    | (number extends config['chains'][number]['id'] ? number : number & {})
}

export type SwitchAccountErrorType =
  | ConnectorNotConnectedErrorType
  | BaseError
  | ErrorType

/** https://wagmi.sh/core/api/actions/switchAccount */
export async function switchAccount<config extends Config>(
  config: config,
  parameters: SwitchAccountParameters,
): Promise<SwitchAccountReturnType<config>> {
  const { connector } = parameters

  const connection = config.state.connections.get(connector.uid)
  if (!connection) throw new ConnectorNotConnectedError()

  await config.storage?.setItem('recentConnectorId', connector.id)
  config.setState((x) => ({
    ...x,
    current: connector.uid,
  }))
  return {
    accounts: connection.accounts,
    networkId: connection.networkId,
  }
}
