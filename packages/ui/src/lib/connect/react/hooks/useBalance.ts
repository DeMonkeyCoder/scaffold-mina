"use client";

import type {
  Config,
  GetBalanceErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetBalanceData,
  type GetBalanceOptions,
  type GetBalanceQueryKey,
  getBalanceQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { GetBalanceQueryFnData } from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseBalanceParameters<
  config extends Config = Config,
  selectData = GetBalanceData
> = Compute<
  GetBalanceOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetBalanceQueryFnData,
      GetBalanceErrorType,
      selectData,
      GetBalanceQueryKey<config>
    >
>;

export type UseBalanceReturnType<selectData = GetBalanceData> =
  UseQueryReturnType<selectData, GetBalanceErrorType>;

/** https://wagmi.sh/react/api/hooks/useBalance */
export function useBalance<
  config extends Config = ResolvedRegister["config"],
  selectData = GetBalanceData
>(
  parameters: UseBalanceParameters<config, selectData> = {}
): UseBalanceReturnType<selectData> {
  const { address, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getBalanceQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(address && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
