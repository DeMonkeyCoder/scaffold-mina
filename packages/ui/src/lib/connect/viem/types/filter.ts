import type { Abi } from "abitype";

import type { BlockNumber, BlockTag } from "./block";
import type { MaybeExtractEventArgsFromAbi } from "./contract";
import type { EIP1193RequestFn, PublicRpcSchema } from "./eip1193";
import type { Hex } from "./misc";
import type { Filter as Filter_ } from "./utils";

export type FilterType = "transaction" | "block" | "event";

type FilterRpcSchema = Filter_<
  PublicRpcSchema,
  {
    Method:
      | "mina_getFilterLogs"
      | "mina_getFilterChanges"
      | "mina_uninstallFilter";
  }
>;

export type Filter<
  filterType extends FilterType = "event",
  abi extends Abi | readonly unknown[] | undefined = undefined,
  eventName extends string | undefined = undefined,
  args extends
    | MaybeExtractEventArgsFromAbi<abi, eventName>
    | undefined = MaybeExtractEventArgsFromAbi<abi, eventName>,
  strict extends boolean | undefined = undefined,
  fromBlock extends BlockNumber | BlockTag | undefined = undefined,
  toBlock extends BlockNumber | BlockTag | undefined = undefined
> = {
  id: Hex;
  request: EIP1193RequestFn<FilterRpcSchema>;
  type: filterType;
} & (filterType extends "event"
  ? {
      fromBlock?: fromBlock | undefined;
      toBlock?: toBlock | undefined;
    } & (abi extends Abi
      ? undefined extends eventName
        ? {
            abi: abi;
            args?: undefined;
            eventName?: undefined;
            strict: strict;
          }
        : args extends MaybeExtractEventArgsFromAbi<abi, eventName>
        ? {
            abi: abi;
            args: args;
            eventName: eventName;
            strict: strict;
          }
        : {
            abi: abi;
            args?: undefined;
            eventName: eventName;
            strict: strict;
          }
      : {
          abi?: undefined;
          args?: undefined;
          eventName?: undefined;
          strict?: undefined;
        })
  : {});
