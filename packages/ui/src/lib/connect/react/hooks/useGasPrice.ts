"use client";

import type {
  Config,
  GetGasPriceErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetGasPriceData,
  type GetGasPriceOptions,
  type GetGasPriceQueryFnData,
  type GetGasPriceQueryKey,
  getGasPriceQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseGasPriceParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetGasPriceData
> = Compute<
  GetGasPriceOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      GetGasPriceQueryFnData,
      GetGasPriceErrorType,
      selectData,
      GetGasPriceQueryKey<config, chainId>
    >
>;

export type UseGasPriceReturnType<selectData = GetGasPriceData> =
  UseQueryReturnType<selectData, GetGasPriceErrorType>;

/** https://wagmi.sh/react/api/hooks/useGasPrice */
export function useGasPrice<
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetGasPriceData
>(
  parameters: UseGasPriceParameters<config, chainId, selectData> = {}
): UseGasPriceReturnType<selectData> {
  const { query = {} } = parameters;

  const config = useConfig(parameters);
  const configChainId = useChainId({ config });
  const chainId = parameters.chainId ?? configChainId;

  const options = getGasPriceQueryOptions(config, {
    ...parameters,
    chainId,
  });

  return useQuery({ ...query, ...options });
}
