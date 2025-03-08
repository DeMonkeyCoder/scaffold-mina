import type {
  Address,
  ResourceUnavailableRpcErrorType,
  UserRejectedRequestErrorType,
} from 'vimina'

import type { CreateConnectorFn } from '../connectors/createConnector'
import type { Config, Connector } from '../createConfig'
import type { BaseErrorType, ErrorType } from '../errors/base'
import {
  ConnectorAlreadyConnectedError,
  type ConnectorAlreadyConnectedErrorType,
} from '../errors/config'
import type { NetworkIdParameter } from '../types/properties'
import type { Compute } from '../types/utils'

export type ConnectParameters<config extends Config = Config> = Compute<
  NetworkIdParameter<config> & {
    connector: Connector | CreateConnectorFn
  }
>

export type ConnectReturnType<config extends Config = Config> = {
  accounts: readonly [Address, ...Address[]]
  networkId:
    | config['chains'][number]['id']
    | (number extends config['chains'][number]['id'] ? number : number & {})
}

export type ConnectErrorType =
  | ConnectorAlreadyConnectedErrorType
  // connector.connect()
  | UserRejectedRequestErrorType
  | ResourceUnavailableRpcErrorType
  // base
  | BaseErrorType
  | ErrorType

/** https://wagmi.sh/core/api/actions/connect */
export async function connect<config extends Config>(
  config: config,
  parameters: ConnectParameters<config>,
): Promise<ConnectReturnType<config>> {
  // "Register" connector if not already created
  let connector: Connector
  if (typeof parameters.connector === 'function') {
    connector = config._internal.connectors.setup(parameters.connector)
  } else connector = parameters.connector

  // Check if connector is already connected
  if (connector.uid === config.state.current)
    throw new ConnectorAlreadyConnectedError()

  try {
    config.setState((x) => ({ ...x, status: 'connecting' }))
    connector.emitter.emit('message', { type: 'connecting' })

    const data = await connector.connect({ networkId: parameters.networkId })
    const accounts = data.accounts as readonly [Address, ...Address[]]

    connector.emitter.off('connect', config._internal.events.connect)
    connector.emitter.on('change', config._internal.events.change)
    connector.emitter.on('disconnect', config._internal.events.disconnect)

    await config.storage?.setItem('recentConnectorId', connector.id)
    config.setState((x) => ({
      ...x,
      connections: new Map(x.connections).set(connector.uid, {
        accounts,
        networkId: data.networkId,
        connector: connector,
      }),
      current: connector.uid,
      status: 'connected',
    }))

    return { accounts, networkId: data.networkId }
  } catch (error) {
    config.setState((x) => ({
      ...x,
      // Keep existing connector connected in case of error
      status: x.current ? 'connected' : 'disconnected',
    }))
    throw error
  }
}
