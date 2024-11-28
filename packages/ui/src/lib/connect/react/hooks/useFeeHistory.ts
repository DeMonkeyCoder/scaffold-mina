"use client";

import type {
  Config,
  GetFeeHistoryErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetFeeHistoryData,
  type GetFeeHistoryOptions,
  type GetFeeHistoryQueryFnData,
  type GetFeeHistoryQueryKey,
  getFeeHistoryQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseFeeHistoryParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetFeeHistoryData
> = Compute<
  GetFeeHistoryOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetFeeHistoryQueryFnData,
      GetFeeHistoryErrorType,
      selectData,
      GetFeeHistoryQueryKey<config, networkId>
    >
>;

export type UseFeeHistoryReturnType<selectData = GetFeeHistoryData> =
  UseQueryReturnType<selectData, GetFeeHistoryErrorType>;

/** https://wagmi.sh/react/api/hooks/useFeeHistory */
export function useFeeHistory<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetFeeHistoryData
>(
  parameters: UseFeeHistoryParameters<config, networkId, selectData> = {}
): UseFeeHistoryReturnType<selectData> {
  const { blockCount, rewardPercentiles, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = getFeeHistoryQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(
    blockCount && rewardPercentiles && (query.enabled ?? true)
  );

  return useQuery({ ...query, ...options, enabled });
}
