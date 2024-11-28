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
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseGasPriceParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetGasPriceData
> = Compute<
  GetGasPriceOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetGasPriceQueryFnData,
      GetGasPriceErrorType,
      selectData,
      GetGasPriceQueryKey<config, networkId>
    >
>;

export type UseGasPriceReturnType<selectData = GetGasPriceData> =
  UseQueryReturnType<selectData, GetGasPriceErrorType>;

/** https://wagmi.sh/react/api/hooks/useGasPrice */
export function useGasPrice<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetGasPriceData
>(
  parameters: UseGasPriceParameters<config, networkId, selectData> = {}
): UseGasPriceReturnType<selectData> {
  const { query = {} } = parameters;

  const config = useConfig(parameters);
  const configNetworkId = useNetworkId({ config });
  const networkId = parameters.networkId ?? configNetworkId;

  const options = getGasPriceQueryOptions(config, {
    ...parameters,
    networkId,
  });

  return useQuery({ ...query, ...options });
}
