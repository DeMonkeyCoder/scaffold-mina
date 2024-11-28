"use client";

import type {
  Config,
  GetTransactionReceiptErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetTransactionReceiptData,
  type GetTransactionReceiptOptions,
  type GetTransactionReceiptQueryKey,
  getTransactionReceiptQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { GetTransactionReceiptQueryFnData } from "@/lib/connect/core/exports/query";
import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseTransactionReceiptParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionReceiptData<config, networkId>
> = Compute<
  GetTransactionReceiptOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionReceiptQueryFnData<config, networkId>,
      GetTransactionReceiptErrorType,
      selectData,
      GetTransactionReceiptQueryKey<config, networkId>
    >
>;

export type UseTransactionReceiptReturnType<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionReceiptData<config, networkId>
> = UseQueryReturnType<selectData, GetTransactionReceiptErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransactionReceipt */
export function useTransactionReceipt<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionReceiptData<config, networkId>
>(
  parameters: UseTransactionReceiptParameters<
    config,
    networkId,
    selectData
  > = {}
): UseTransactionReceiptReturnType<config, networkId, selectData> {
  const { hash, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = getTransactionReceiptQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(hash && (query.enabled ?? true));

  return useQuery({
    ...(query as any),
    ...options,
    enabled,
  }) as UseTransactionReceiptReturnType<config, networkId, selectData>;
}
