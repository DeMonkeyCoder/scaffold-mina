import {
  type Client,
  type ClientConfig,
  type CreateClientErrorType,
  createClient,
} from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { PaymasterRpcSchema, RpcSchema } from '../../types/eip1193'
import type { Prettify } from '../../types/utils'
import {
  type PaymasterActions,
  paymasterActions,
} from './decorators/paymaster'

export type PaymasterClientConfig<
  transport extends Transport = Transport,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Pick<
    ClientConfig<transport, undefined, undefined, rpcSchema>,
    'cacheTime' | 'key' | 'name' | 'pollingInterval' | 'rpcSchema' | 'transport'
  >
>

export type PaymasterClient<
  transport extends Transport = Transport,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Client<
    transport,
    undefined,
    undefined,
    rpcSchema extends RpcSchema
      ? [...PaymasterRpcSchema, ...rpcSchema]
      : PaymasterRpcSchema,
    PaymasterActions
  >
>

export type CreatePaymasterClientErrorType = CreateClientErrorType | ErrorType

/**
 * Creates a Paymaster Client.
 *
 * - Docs: https://viem.sh/account-abstraction/clients/paymaster
 *
 * @param config - {@link PaymasterClientConfig}
 * @returns A Paymaster Client. {@link PaymasterClient}
 *
 * @example
 * import { http } from 'viem'
 * import { createPaymasterClient } from 'viem/account-abstraction'
 *
 * const paymasterClient = createPaymasterClient({
 *   transport: http('https://...'),
 * })
 */
export function createPaymasterClient<
  transport extends Transport,
  rpcSchema extends RpcSchema | undefined = undefined,
>(
  parameters: PaymasterClientConfig<transport, rpcSchema>,
): PaymasterClient<transport, rpcSchema>

export function createPaymasterClient(
  parameters: PaymasterClientConfig,
): PaymasterClient {
  const { key = 'bundler', name = 'Bundler Client', transport } = parameters
  const client = createClient({
    ...parameters,
    key,
    name,
    transport,
    type: 'PaymasterClient',
  })
  return client.extend(paymasterActions)
}
