import {
  type Account,
  type Address,
  type BaseErrorType,
  type Client,
  type Transport,
  createClient,
  custom,
} from 'vimina'
import { getAddress, parseAccount } from 'vimina/utils'

import type { Config, Connection } from '../createConfig'
import type { ErrorType } from '../errors/base'
import {
  ConnectorAccountNotFoundError,
  type ConnectorAccountNotFoundErrorType,
  ConnectorChainMismatchError,
  type ConnectorChainMismatchErrorType,
  ConnectorNotConnectedError,
  type ConnectorNotConnectedErrorType,
} from '../errors/config'
import type {
  ConnectorParameter,
  NetworkIdParameter,
} from '../types/properties'
import type { Compute } from '../types/utils'

export type GetConnectorClientParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<
  NetworkIdParameter<config, networkId> &
    ConnectorParameter & {
      account?: Address | Account | undefined
    }
>

export type GetConnectorClientReturnType<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<
  Client<
    config['_internal']['transports'][networkId],
    Extract<config['chains'][number], { id: networkId }>,
    Account
  >
>

export type GetConnectorClientErrorType =
  | ConnectorAccountNotFoundErrorType
  | ConnectorChainMismatchErrorType
  | ConnectorNotConnectedErrorType
  // base
  | BaseErrorType
  | ErrorType

/** https://wagmi.sh/core/api/actions/getConnectorClient */
export async function getConnectorClient<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: GetConnectorClientParameters<config, networkId> = {},
): Promise<GetConnectorClientReturnType<config, networkId>> {
  // Get connection
  let connection: Connection | undefined
  if (parameters.connector) {
    const { connector } = parameters
    const [accounts, networkId] = await Promise.all([
      connector.getAccounts(),
      connector.getNetworkId(),
    ])
    connection = {
      accounts: accounts as readonly [Address, ...Address[]],
      networkId,
      connector,
    }
  } else connection = config.state.connections.get(config.state.current!)
  if (!connection) throw new ConnectorNotConnectedError()

  const networkId = parameters.networkId ?? connection.networkId

  // Check connector using same networkId as connection
  const connectorNetworkId = await connection.connector.getNetworkId()
  if (connectorNetworkId !== connection.networkId)
    throw new ConnectorChainMismatchError({
      connectionNetworkId: connection.networkId,
      connectorNetworkId,
    })

  // If connector has custom `getClient` implementation
  type Return = GetConnectorClientReturnType<config, networkId>
  const connector = connection.connector
  if (connector.getClient)
    return connector.getClient({ networkId }) as unknown as Return

  // Default using `custom` transport
  const account = parseAccount(parameters.account ?? connection.accounts[0]!)
  account.address = getAddress(account.address) // TODO: Checksum address as part of `parseAccount`?

  const chain = config.chains.find((chain) => chain.id === networkId)
  const provider = (await connection.connector.getProvider({ networkId })) as {
    request(...args: any): Promise<any>
  }

  // If account was provided, check that it exists on the connector
  if (
    parameters.account &&
    !connection.accounts.some((x) => x === account.address)
  )
    throw new ConnectorAccountNotFoundError({
      address: account.address,
      connector,
    })

  return createClient({
    account,
    chain,
    name: 'Connector Client',
    transport: ((opts) =>
      custom(provider)({ ...opts, retryCount: 0 })) as Transport,
  }) as Return
}
