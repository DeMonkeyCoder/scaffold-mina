"use client";

import type {
  Config,
  GetTransactionErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetTransactionData,
  type GetTransactionOptions,
  type GetTransactionQueryFnData,
  type GetTransactionQueryKey,
  getTransactionQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseTransactionParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, chainId>
> = Compute<
  GetTransactionOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionQueryFnData<config, chainId>,
      GetTransactionErrorType,
      selectData,
      GetTransactionQueryKey<config, chainId>
    >
>;

export type UseTransactionReturnType<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, chainId>
> = UseQueryReturnType<selectData, GetTransactionErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransaction */
export function useTransaction<
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, chainId>
>(
  parameters: UseTransactionParameters<config, chainId, selectData> = {}
): UseTransactionReturnType<config, chainId, selectData> {
  const { blockHash, blockNumber, blockTag, hash, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getTransactionQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(
    !(blockHash && blockNumber && blockTag && hash) && (query.enabled ?? true)
  );

  return useQuery({
    ...(query as any),
    ...options,
    enabled,
  }) as UseTransactionReturnType<config, chainId, selectData>;
}
