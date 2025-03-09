import {
  ChainDisconnectedError,
  type JSAPIStandardParameters,
  type JSAPIStandardProvider,
  type JSAPIStandardRequestFn,
  ProviderDisconnectedError,
  type TransportConfig,
  type WalletRpcSchema,
  createTransport,
  withRetry,
  withTimeout,
} from 'vimina'

import type { Connector, Transport } from '../createConfig'

export type ConnectorTransportConfig = {
  /** The key of the transport. */
  key?: TransportConfig['key'] | undefined
  /** The name of the transport. */
  name?: TransportConfig['name'] | undefined
  /** The max number of times to retry. */
  retryCount?: TransportConfig['retryCount'] | undefined
  /** The base delay (in ms) between retries. */
  retryDelay?: TransportConfig['retryDelay'] | undefined
}

export type ConnectorTransport = Transport

export function unstable_connector(
  connector: Pick<Connector, 'type'>,
  config: ConnectorTransportConfig = {},
): Transport<'connector'> {
  const { type } = connector
  const { key = 'connector', name = 'Connector', retryDelay } = config

  return (parameters) => {
    const { chain, connectors } = parameters
    const retryCount = config.retryCount ?? parameters.retryCount

    const request: JSAPIStandardRequestFn = async ({ method, params }) => {
      const connector = connectors?.getState().find((c) => c.type === type)
      if (!connector)
        throw new ProviderDisconnectedError(
          new Error(
            `Could not find connector of type "${type}" in \`connectors\` passed to \`createConfig\`.`,
          ),
        )

      const provider = (await connector.getProvider({
        networkId: chain?.id,
      })) as JSAPIStandardProvider | undefined
      if (!provider)
        throw new ProviderDisconnectedError(
          new Error('Provider is disconnected.'),
        )

      // We are applying a retry & timeout strategy here as some injected wallets (e.g. MetaMask) fail to
      // immediately resolve a JSON-RPC request on page load.
      const networkId = await withRetry(() =>
        withTimeout(() => provider.request({ method: 'mina_networkId' }), {
          timeout: 100,
        }),
      )
      if (chain && networkId !== chain.id)
        throw new ChainDisconnectedError(
          new Error(
            `The current chain of the connector (id: ${networkId}) does not match the target chain for the request (id: ${chain.id} – ${chain.name}).`,
          ),
        )

      const body = {
        method,
        params,
      } as JSAPIStandardParameters<WalletRpcSchema>
      return provider.request(body)
    }

    return createTransport({
      key,
      name,
      request,
      retryCount,
      retryDelay,
      type: 'connector',
    })
  }
}
