import type { AbiEvent, Address } from "abitype";

import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { BlockNumber, BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";
import type {
  MaybeAbiEventName,
  MaybeExtractEventArgsFromAbi,
} from "../../types/contract";
import type { Filter } from "../../types/filter";
import type { Hex, LogTopic } from "../../types/misc";
import type { Prettify } from "../../types/utils";
import {
  type EncodeEventTopicsErrorType,
  type EncodeEventTopicsParameters,
  encodeEventTopics,
} from "../../utils/abi/encodeEventTopics";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  type NumberToHexErrorType,
  numberToHex,
} from "../../utils/encoding/toHex";
import { createFilterRequestScope } from "../../utils/filters/createFilterRequestScope";

export type CreateEventFilterParameters<
  abiEvent extends AbiEvent | undefined = undefined,
  abiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockNumber | BlockTag | undefined = undefined,
  toBlock extends BlockNumber | BlockTag | undefined = undefined,
  //
  _eventName extends string | undefined = MaybeAbiEventName<abiEvent>,
  _args extends
    | MaybeExtractEventArgsFromAbi<abiEvents, _eventName>
    | undefined = undefined
> = {
  address?: Address | Address[] | undefined;
  fromBlock?: fromBlock | BlockNumber | BlockTag | undefined;
  toBlock?: toBlock | BlockNumber | BlockTag | undefined;
} & (MaybeExtractEventArgsFromAbi<
  abiEvents,
  _eventName
> extends infer eventFilterArgs
  ?
      | {
          args:
            | eventFilterArgs
            | (_args extends eventFilterArgs ? _args : never);
          event: abiEvent;
          events?: undefined;
          /**
           * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
           * @default false
           */
          strict?: strict | undefined;
        }
      | {
          args?: undefined;
          event?: abiEvent | undefined;
          events?: undefined;
          /**
           * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
           * @default false
           */
          strict?: strict | undefined;
        }
      | {
          args?: undefined;
          event?: undefined;
          events: abiEvents | undefined;
          /**
           * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
           * @default false
           */
          strict?: strict | undefined;
        }
      | {
          args?: undefined;
          event?: undefined;
          events?: undefined;
          strict?: undefined;
        }
  : {
      args?: undefined;
      event?: undefined;
      events?: undefined;
      strict?: undefined;
    });

export type CreateEventFilterReturnType<
  abiEvent extends AbiEvent | undefined = undefined,
  abiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockNumber | BlockTag | undefined = undefined,
  toBlock extends BlockNumber | BlockTag | undefined = undefined,
  _eventName extends string | undefined = MaybeAbiEventName<abiEvent>,
  _args extends
    | MaybeExtractEventArgsFromAbi<abiEvents, _eventName>
    | undefined = undefined
> = Prettify<
  Filter<"event", abiEvents, _eventName, _args, strict, fromBlock, toBlock>
>;

export type CreateEventFilterErrorType =
  | EncodeEventTopicsErrorType
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

/**
 * Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
 *
 * - Docs: https://viem.sh/docs/actions/public/createEventFilter
 * - JSON-RPC Methods: [`mina_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newfilter)
 *
 * @param client - Client to use
 * @param parameters - {@link CreateEventFilterParameters}
 * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateEventFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEventFilter } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createEventFilter(client, {
 *   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 * })
 */
export async function createEventFilter<
  chain extends Chain | undefined,
  const abiEvent extends AbiEvent | undefined = undefined,
  const abiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockNumber<bigint> | BlockTag | undefined = undefined,
  toBlock extends BlockNumber<bigint> | BlockTag | undefined = undefined,
  _eventName extends string | undefined = MaybeAbiEventName<abiEvent>,
  _args extends
    | MaybeExtractEventArgsFromAbi<abiEvents, _eventName>
    | undefined = undefined
>(
  client: Client<Transport, chain>,
  {
    address,
    args,
    event,
    events: events_,
    fromBlock,
    strict,
    toBlock,
  }: CreateEventFilterParameters<
    abiEvent,
    abiEvents,
    strict,
    fromBlock,
    toBlock,
    _eventName,
    _args
  > = {} as any
): Promise<
  CreateEventFilterReturnType<
    abiEvent,
    abiEvents,
    strict,
    fromBlock,
    toBlock,
    _eventName,
    _args
  >
> {
  const events = events_ ?? (event ? [event] : undefined);

  const getRequest = createFilterRequestScope(client, {
    method: "mina_newFilter",
  });

  let topics: LogTopic[] = [];
  if (events) {
    const encoded = (events as AbiEvent[]).flatMap((event) =>
      encodeEventTopics({
        abi: [event],
        eventName: (event as AbiEvent).name,
        args,
      } as EncodeEventTopicsParameters)
    );
    // TODO: Clean up type casting
    topics = [encoded as LogTopic];
    if (event) topics = topics[0] as LogTopic[];
  }

  const id: Hex = await client.request({
    method: "mina_newFilter",
    params: [
      {
        address,
        fromBlock:
          typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        ...(topics.length ? { topics } : {}),
      },
    ],
  });

  return {
    abi: events,
    args,
    eventName: event ? (event as AbiEvent).name : undefined,
    fromBlock,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    toBlock,
    type: "event",
  } as unknown as CreateEventFilterReturnType<
    abiEvent,
    abiEvents,
    strict,
    fromBlock,
    toBlock,
    _eventName,
    _args
  >;
}
