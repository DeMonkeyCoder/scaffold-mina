import type { QueryOptions } from "@tanstack/query-core";

import {
  type GetBlockTransactionCountErrorType,
  type GetBlockTransactionCountParameters,
  type GetBlockTransactionCountReturnType,
  getBlockTransactionCount,
} from "../actions/getBlockTransactionCount";
import type { Config } from "../createConfig";
import type { ScopeKeyParameter } from "../types/properties";
import type { ExactPartial, UnionCompute } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type GetBlockTransactionCountOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = UnionCompute<
  ExactPartial<GetBlockTransactionCountParameters<config, networkId>> &
    ScopeKeyParameter
>;

export function getBlockTransactionCountQueryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  options: GetBlockTransactionCountOptions<config, networkId> = {}
) {
  return {
    async queryFn({ queryKey }) {
      const { scopeKey: _, ...parameters } = queryKey[1];
      const blockTransactionCount = await getBlockTransactionCount(
        config,
        parameters
      );
      return blockTransactionCount ?? null;
    },
    queryKey: getBlockTransactionCountQueryKey(options),
  } as const satisfies QueryOptions<
    GetBlockTransactionCountQueryFnData,
    GetBlockTransactionCountErrorType,
    GetBlockTransactionCountData,
    GetBlockTransactionCountQueryKey<config, networkId>
  >;
}

export type GetBlockTransactionCountQueryFnData =
  GetBlockTransactionCountReturnType;

export type GetBlockTransactionCountData = GetBlockTransactionCountQueryFnData;

export function getBlockTransactionCountQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(options: GetBlockTransactionCountOptions<config, networkId> = {}) {
  return ["blockTransactionCount", filterQueryOptions(options)] as const;
}

export type GetBlockTransactionCountQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = ReturnType<typeof getBlockTransactionCountQueryKey<config, networkId>>;
