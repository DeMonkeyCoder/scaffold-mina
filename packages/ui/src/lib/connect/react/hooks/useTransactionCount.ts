"use client";

import type {
  Config,
  GetTransactionCountErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import type { GetTransactionCountQueryFnData } from "@/lib/connect/core/exports/query";
import {
  type GetTransactionCountData,
  type GetTransactionCountOptions,
  type GetTransactionCountQueryKey,
  getTransactionCountQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseTransactionCountParameters<
  config extends Config = Config,
  selectData = GetTransactionCountData
> = Compute<
  GetTransactionCountOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionCountQueryFnData,
      GetTransactionCountErrorType,
      selectData,
      GetTransactionCountQueryKey<config>
    >
>;

export type UseTransactionCountReturnType<
  selectData = GetTransactionCountData
> = UseQueryReturnType<selectData, GetTransactionCountErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransactionCount */
export function useTransactionCount<
  config extends Config = ResolvedRegister["config"],
  selectData = GetTransactionCountData
>(
  parameters: UseTransactionCountParameters<config, selectData> = {}
): UseTransactionCountReturnType<selectData> {
  const { address, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getTransactionCountQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(address && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
