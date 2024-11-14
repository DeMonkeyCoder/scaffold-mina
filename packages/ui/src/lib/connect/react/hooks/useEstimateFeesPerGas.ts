"use client";

import type {
  Config,
  EstimateFeesPerGasErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type EstimateFeesPerGasData,
  type EstimateFeesPerGasOptions,
  type EstimateFeesPerGasQueryFnData,
  type EstimateFeesPerGasQueryKey,
  estimateFeesPerGasQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { FeeValuesType } from "@/lib/connect/viem";

import type { ConfigParameter, QueryParameter } from "../types/properties.js";
import { type UseQueryReturnType, useQuery } from "../utils/query.js";
import { useChainId } from "./useChainId.js";
import { useConfig } from "./useConfig.js";

export type UseEstimateFeesPerGasParameters<
  type extends FeeValuesType = FeeValuesType,
  config extends Config = Config,
  selectData = EstimateFeesPerGasData<type>
> = Compute<
  EstimateFeesPerGasOptions<type, config> &
    ConfigParameter<config> &
    QueryParameter<
      EstimateFeesPerGasQueryFnData<type>,
      EstimateFeesPerGasErrorType,
      selectData,
      EstimateFeesPerGasQueryKey<config, type>
    >
>;

export type UseEstimateFeesPerGasReturnType<
  type extends FeeValuesType = FeeValuesType,
  selectData = EstimateFeesPerGasData<type>
> = UseQueryReturnType<selectData, EstimateFeesPerGasErrorType>;

/** https://wagmi.sh/react/api/hooks/useEstimateFeesPerGas */
export function useEstimateFeesPerGas<
  config extends Config = ResolvedRegister["config"],
  type extends FeeValuesType = "eip1559",
  selectData = EstimateFeesPerGasData<type>
>(
  parameters: UseEstimateFeesPerGasParameters<type, config, selectData> = {}
): UseEstimateFeesPerGasReturnType<type, selectData> {
  const { query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = estimateFeesPerGasQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });

  return useQuery({ ...query, ...options });
}
