"use client";

import type {
  Config,
  GetBlockTransactionCountErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { UnionCompute } from "@/lib/connect/core/exports/internal";
import {
  type GetBlockTransactionCountData,
  type GetBlockTransactionCountOptions,
  type GetBlockTransactionCountQueryFnData,
  type GetBlockTransactionCountQueryKey,
  getBlockTransactionCountQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseBlockTransactionCountParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockTransactionCountData
> = UnionCompute<
  GetBlockTransactionCountOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetBlockTransactionCountQueryFnData,
      GetBlockTransactionCountErrorType,
      selectData,
      GetBlockTransactionCountQueryKey<config, networkId>
    >
>;

export type UseBlockTransactionCountReturnType<
  selectData = GetBlockTransactionCountData
> = UseQueryReturnType<selectData, GetBlockTransactionCountErrorType>;

/** https://wagmi.sh/react/api/hooks/useBlockTransactionCount */
export function useBlockTransactionCount<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockTransactionCountData
>(
  parameters: UseBlockTransactionCountParameters<
    config,
    networkId,
    selectData
  > = {}
): UseBlockTransactionCountReturnType<selectData> {
  const { query = {} } = parameters;

  const config = useConfig(parameters);
  const configNetworkId = useNetworkId({ config });
  const networkId = parameters.networkId ?? configNetworkId;

  const options = getBlockTransactionCountQueryOptions(config, {
    ...parameters,
    networkId,
  });

  return useQuery({ ...query, ...options });
}
