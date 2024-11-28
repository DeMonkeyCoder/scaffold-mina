import type { QueryOptions } from "@tanstack/query-core";
import type { BlockTag } from "@/lib/connect/viem";

import {
  type GetBlockErrorType,
  type GetBlockParameters,
  type GetBlockReturnType,
  getBlock,
} from "../actions/getBlock";
import type { Config } from "../createConfig";
import type { ScopeKeyParameter } from "../types/properties";
import type { Compute, ExactPartial } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type GetBlockOptions<
  includeTransactions extends boolean,
  blockTag extends BlockTag,
  config extends Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  ExactPartial<
    GetBlockParameters<includeTransactions, blockTag, config, networkId>
  > &
    ScopeKeyParameter
>;

export function getBlockQueryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"],
  includeTransactions extends boolean,
  blockTag extends BlockTag
>(
  config: config,
  options: GetBlockOptions<
    includeTransactions,
    blockTag,
    config,
    networkId
  > = {}
) {
  return {
    async queryFn({ queryKey }) {
      const { scopeKey: _, ...parameters } = queryKey[1];
      const block = await getBlock(config, parameters);
      return (block ?? null) as any;
    },
    queryKey: getBlockQueryKey(options),
  } as const satisfies QueryOptions<
    GetBlockQueryFnData<includeTransactions, blockTag, config, networkId>,
    GetBlockErrorType,
    GetBlockData<includeTransactions, blockTag, config, networkId>,
    GetBlockQueryKey<includeTransactions, blockTag, config, networkId>
  >;
}

export type GetBlockQueryFnData<
  includeTransactions extends boolean,
  blockTag extends BlockTag,
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = GetBlockReturnType<includeTransactions, blockTag, config, networkId>;

export type GetBlockData<
  includeTransactions extends boolean,
  blockTag extends BlockTag,
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = GetBlockQueryFnData<includeTransactions, blockTag, config, networkId>;

export function getBlockQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"],
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest"
>(
  options: GetBlockOptions<
    includeTransactions,
    blockTag,
    config,
    networkId
  > = {}
) {
  return ["block", filterQueryOptions(options)] as const;
}

export type GetBlockQueryKey<
  includeTransactions extends boolean,
  blockTag extends BlockTag,
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = ReturnType<
  typeof getBlockQueryKey<config, networkId, includeTransactions, blockTag>
>;
