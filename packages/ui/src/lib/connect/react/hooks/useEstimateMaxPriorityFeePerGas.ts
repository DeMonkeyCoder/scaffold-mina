"use client";

import type {
  Config,
  EstimateMaxPriorityFeePerGasErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type EstimateMaxPriorityFeePerGasData,
  type EstimateMaxPriorityFeePerGasOptions,
  type EstimateMaxPriorityFeePerGasQueryFnData,
  type EstimateMaxPriorityFeePerGasQueryKey,
  estimateMaxPriorityFeePerGasQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseEstimateMaxPriorityFeePerGasParameters<
  config extends Config = Config,
  selectData = EstimateMaxPriorityFeePerGasData
> = Compute<
  EstimateMaxPriorityFeePerGasOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      EstimateMaxPriorityFeePerGasQueryFnData,
      EstimateMaxPriorityFeePerGasErrorType,
      selectData,
      EstimateMaxPriorityFeePerGasQueryKey<config>
    >
>;

export type UseEstimateMaxPriorityFeePerGasReturnType<
  selectData = EstimateMaxPriorityFeePerGasData
> = UseQueryReturnType<selectData, EstimateMaxPriorityFeePerGasErrorType>;

/** https://wagmi.sh/react/api/hooks/useEstimateMaxPriorityFeePerGas */
export function useEstimateMaxPriorityFeePerGas<
  config extends Config = ResolvedRegister["config"],
  selectData = EstimateMaxPriorityFeePerGasData
>(
  parameters: UseEstimateMaxPriorityFeePerGasParameters<config, selectData> = {}
): UseEstimateMaxPriorityFeePerGasReturnType<selectData> {
  const { query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = estimateMaxPriorityFeePerGasQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });

  return useQuery({ ...query, ...options });
}
