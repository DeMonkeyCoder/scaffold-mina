import type { Transport } from '../clients/transports/createTransport'
import type { FallbackTransport } from '../clients/transports/fallback'
import type { Some } from './utils'

export type GetTransportConfig<transport extends Transport> =
  ReturnType<transport>['config']

export type GetPollOptions<transport extends Transport> =
  | (HasTransportType<transport, 'webSocket'> extends true
      ? {
          batch?: undefined
          /**
           * Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `mina_subscribe`.
           * @default false
           */
          poll?: false | undefined
          pollingInterval?: undefined
        }
      : never)
  | {
      poll?: true | undefined
      /**
       * Whether or not the transaction hashes should be batched on each invocation.
       * @default true
       */
      batch?: boolean | undefined
      /**
       * Polling frequency (in ms). Defaults to Client's pollingInterval config.
       * @default client.pollingInterval
       */
      pollingInterval?: number | undefined
    }

export type HasTransportType<
  transport extends Transport,
  type extends string,
> = GetTransportConfig<transport>['type'] extends type
  ? true
  : transport extends FallbackTransport<
        infer transports extends readonly Transport[]
      >
    ? Some<
        {
          [key in keyof transports]: GetTransportConfig<transports[key]>['type']
        },
        type
      >
    : false
