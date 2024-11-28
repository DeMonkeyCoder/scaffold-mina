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
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseTransactionParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, networkId>
> = Compute<
  GetTransactionOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionQueryFnData<config, networkId>,
      GetTransactionErrorType,
      selectData,
      GetTransactionQueryKey<config, networkId>
    >
>;

export type UseTransactionReturnType<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, networkId>
> = UseQueryReturnType<selectData, GetTransactionErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransaction */
export function useTransaction<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, networkId>
>(
  parameters: UseTransactionParameters<config, networkId, selectData> = {}
): UseTransactionReturnType<config, networkId, selectData> {
  const { blockHash, blockNumber, blockTag, hash, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = getTransactionQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(
    !(blockHash && blockNumber && blockTag && hash) && (query.enabled ?? true)
  );

  return useQuery({
    ...(query as any),
    ...options,
    enabled,
  }) as UseTransactionReturnType<config, networkId, selectData>;
}
