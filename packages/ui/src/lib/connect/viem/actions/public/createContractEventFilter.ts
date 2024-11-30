import type { Abi, Address } from "abitype";

import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { BlockHash, BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";
import type {
  ContractEventName,
  MaybeExtractEventArgsFromAbi,
} from "../../types/contract";
import type { Filter } from "../../types/filter";
import type { Hex } from "../../types/misc";
import {
  encodeEventTopics,
  type EncodeEventTopicsErrorType,
  type EncodeEventTopicsParameters,
} from "../../utils/abi/encodeEventTopics";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  numberToHex,
  type NumberToHexErrorType,
} from "../../utils/encoding/toHex";
import { createFilterRequestScope } from "../../utils/filters/createFilterRequestScope";

export type CreateContractEventFilterParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> | undefined = undefined,
  args extends
    | MaybeExtractEventArgsFromAbi<abi, eventName>
    | undefined = undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockHash | BlockTag | undefined = undefined,
  toBlock extends BlockHash | BlockTag | undefined = undefined
> = {
  address?: Address | Address[] | undefined;
  abi: abi;
  eventName?: eventName | ContractEventName<abi> | undefined;
  fromBlock?: fromBlock | BlockHash | BlockTag | undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments in the event ABI item.
   * @default false
   */
  strict?: strict | boolean | undefined;
  toBlock?: toBlock | BlockHash | BlockTag | undefined;
} & (undefined extends eventName
  ? {
      args?: undefined;
    }
  : MaybeExtractEventArgsFromAbi<abi, eventName> extends infer eventFilterArgs
  ? {
      args?:
        | eventFilterArgs
        | (args extends eventFilterArgs ? args : never)
        | undefined;
    }
  : {
      args?: undefined;
    });

export type CreateContractEventFilterReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> | undefined = undefined,
  args extends
    | MaybeExtractEventArgsFromAbi<abi, eventName>
    | undefined = undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockHash | BlockTag | undefined = undefined,
  toBlock extends BlockHash | BlockTag | undefined = undefined
> = Filter<"event", abi, eventName, args, strict, fromBlock, toBlock>;

export type CreateContractEventFilterErrorType =
  | EncodeEventTopicsErrorType
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

/**
 * Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).
 *
 * - Docs: https://viem.sh/docs/contract/createContractEventFilter
 *
 * @param client - Client to use
 * @param parameters - {@link CreateContractEventFilterParameters}
 * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateContractEventFilterReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createContractEventFilter } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createContractEventFilter(client, {
 *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
 * })
 */
export async function createContractEventFilter<
  chain extends Chain | undefined,
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi> | undefined,
  args extends MaybeExtractEventArgsFromAbi<abi, eventName> | undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockHash | BlockTag | undefined = undefined,
  toBlock extends BlockHash | BlockTag | undefined = undefined
>(
  client: Client<Transport, chain>,
  parameters: CreateContractEventFilterParameters<
    abi,
    eventName,
    args,
    strict,
    fromBlock,
    toBlock
  >
): Promise<
  CreateContractEventFilterReturnType<
    abi,
    eventName,
    args,
    strict,
    fromBlock,
    toBlock
  >
> {
  const { address, abi, args, eventName, fromBlock, strict, toBlock } =
    parameters as CreateContractEventFilterParameters;

  const getRequest = createFilterRequestScope(client, {
    method: "mina_newFilter",
  });

  const topics = eventName
    ? encodeEventTopics({
        abi,
        args,
        eventName,
      } as unknown as EncodeEventTopicsParameters)
    : undefined;
  const id: Hex = await client.request({
    method: "mina_newFilter",
    params: [
      {
        address,
        fromBlock:
          typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        topics,
      },
    ],
  });

  return {
    abi,
    args,
    eventName,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    type: "event",
  } as unknown as CreateContractEventFilterReturnType<
    abi,
    eventName,
    args,
    strict,
    fromBlock,
    toBlock
  >;
}
