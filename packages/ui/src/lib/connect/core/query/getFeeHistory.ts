import type { QueryOptions } from "@tanstack/query-core";

import {
  type GetFeeHistoryErrorType,
  type GetFeeHistoryParameters,
  type GetFeeHistoryReturnType,
  getFeeHistory,
} from "../actions/getFeeHistory";
import type { Config } from "../createConfig";
import type { ScopeKeyParameter } from "../types/properties";
import type { Compute, PartialBy } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type GetFeeHistoryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = Compute<
  PartialBy<
    GetFeeHistoryParameters<config, networkId>,
    "blockCount" | "rewardPercentiles"
  > &
    ScopeKeyParameter
>;

export function getFeeHistoryQueryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(config: config, options: GetFeeHistoryOptions<config, networkId> = {}) {
  return {
    async queryFn({ queryKey }) {
      const {
        blockCount,
        rewardPercentiles,
        scopeKey: _,
        ...parameters
      } = queryKey[1];
      if (!blockCount) throw new Error("blockCount is required");
      if (!rewardPercentiles) throw new Error("rewardPercentiles is required");
      const feeHistory = await getFeeHistory(config, {
        ...(parameters as GetFeeHistoryParameters),
        blockCount,
        rewardPercentiles,
      });
      return feeHistory ?? null;
    },
    queryKey: getFeeHistoryQueryKey(options),
  } as const satisfies QueryOptions<
    GetFeeHistoryQueryFnData,
    GetFeeHistoryErrorType,
    GetFeeHistoryData,
    GetFeeHistoryQueryKey<config, networkId>
  >;
}

export type GetFeeHistoryQueryFnData = GetFeeHistoryReturnType;

export type GetFeeHistoryData = GetFeeHistoryQueryFnData;

export function getFeeHistoryQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(options: GetFeeHistoryOptions<config, networkId> = {}) {
  return ["feeHistory", filterQueryOptions(options)] as const;
}

export type GetFeeHistoryQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = ReturnType<typeof getFeeHistoryQueryKey<config, networkId>>;
