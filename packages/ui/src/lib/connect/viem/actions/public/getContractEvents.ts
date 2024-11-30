import type { Abi, Address } from "abitype";

import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { BlockHash, BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";
import type {
  ContractEventArgs,
  ContractEventName,
} from "../../types/contract";
import type { Log } from "../../types/log";
import type { Hash } from "../../types/misc";
import {
  getAbiItem,
  type GetAbiItemErrorType,
  type GetAbiItemParameters,
} from "../../utils/abi/getAbiItem";
import { getAction } from "../../utils/getAction";
import {
  getLogs,
  type GetLogsErrorType,
  type GetLogsParameters,
} from "./getLogs";

export type GetContractEventsParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> | undefined =
    | ContractEventName<abi>
    | undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockHash | BlockTag | undefined = undefined,
  toBlock extends BlockHash | BlockTag | undefined = undefined
> = {
  /** The address of the contract. */
  address?: Address | Address[] | undefined;
  /** Contract ABI. */
  abi: abi;
  args?:
    | ContractEventArgs<
        abi,
        eventName extends ContractEventName<abi>
          ? eventName
          : ContractEventName<abi>
      >
    | undefined;
  /** Contract event. */
  eventName?: eventName | ContractEventName<abi> | undefined;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict | boolean | undefined;
} & (
  | {
      /** Block number or tag after which to include logs */
      fromBlock?: fromBlock | BlockHash | BlockTag | undefined;
      /** Block number or tag before which to include logs */
      toBlock?: toBlock | BlockHash | BlockTag | undefined;
      blockHash?: undefined;
    }
  | {
      fromBlock?: undefined;
      toBlock?: undefined;
      /** Hash of block to include logs from */
      blockHash?: Hash | undefined;
    }
);

export type GetContractEventsReturnType<
  abi extends Abi | readonly unknown[] = readonly unknown[],
  eventName extends ContractEventName<abi> | undefined =
    | ContractEventName<abi>
    | undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockHash | BlockTag | undefined = undefined,
  toBlock extends BlockHash | BlockTag | undefined = undefined,
  ///
  isPending extends boolean =
    | (fromBlock extends "pending" ? true : false)
    | (toBlock extends "pending" ? true : false)
> = Log<bigint, number, isPending, undefined, strict, abi, eventName>[];

export type GetContractEventsErrorType =
  | GetAbiItemErrorType
  | GetLogsErrorType
  | ErrorType;

/**
 * Returns a list of event logs emitted by a contract.
 *
 * - Docs: https://viem.sh/docs/actions/public/getContractEvents
 * - JSON-RPC Methods: [`mina_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getlogs)
 *
 * @param client - Client to use
 * @param parameters - {@link GetContractEventsParameters}
 * @returns A list of event logs. {@link GetContractEventsReturnType}
 *
 * @example
 * import { createClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getContractEvents } from 'viem/public'
 * import { wagmiAbi } from './abi'
 *
 * const client = createClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const logs = await getContractEvents(client, {
 *  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *  abi: wagmiAbi,
 *  eventName: 'Transfer'
 * })
 */
export async function getContractEvents<
  chain extends Chain | undefined,
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi> | undefined = undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockHash | BlockTag | undefined = undefined,
  toBlock extends BlockHash | BlockTag | undefined = undefined
>(
  client: Client<Transport, chain>,
  parameters: GetContractEventsParameters<
    abi,
    eventName,
    strict,
    fromBlock,
    toBlock
  >
): Promise<
  GetContractEventsReturnType<abi, eventName, strict, fromBlock, toBlock>
> {
  const {
    abi,
    address,
    args,
    blockHash,
    eventName,
    fromBlock,
    toBlock,
    strict,
  } = parameters;
  const event = eventName
    ? getAbiItem({ abi, name: eventName } as GetAbiItemParameters)
    : undefined;
  const events = !event
    ? (abi as Abi).filter((x) => x.type === "event")
    : undefined;
  return getAction(
    client,
    getLogs,
    "getLogs"
  )({
    address,
    args,
    blockHash,
    event,
    events,
    fromBlock,
    toBlock,
    strict,
  } as {} as GetLogsParameters) as unknown as GetContractEventsReturnType<
    abi,
    eventName,
    strict,
    fromBlock,
    toBlock
  >;
}
