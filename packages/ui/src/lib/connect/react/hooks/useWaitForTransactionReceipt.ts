"use client";

import type {
  Config,
  ResolvedRegister,
  WaitForTransactionReceiptErrorType,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type WaitForTransactionReceiptData,
  type WaitForTransactionReceiptOptions,
  type WaitForTransactionReceiptQueryFnData,
  type WaitForTransactionReceiptQueryKey,
  waitForTransactionReceiptQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseWaitForTransactionReceiptParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = WaitForTransactionReceiptData<config, networkId>
> = Compute<
  WaitForTransactionReceiptOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      WaitForTransactionReceiptQueryFnData<config, networkId>,
      WaitForTransactionReceiptErrorType,
      selectData,
      WaitForTransactionReceiptQueryKey<config, networkId>
    >
>;

export type UseWaitForTransactionReceiptReturnType<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = WaitForTransactionReceiptData<config, networkId>
> = UseQueryReturnType<selectData, WaitForTransactionReceiptErrorType>;

/** https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt */
export function useWaitForTransactionReceipt<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = WaitForTransactionReceiptData<config, networkId>
>(
  parameters: UseWaitForTransactionReceiptParameters<
    config,
    networkId,
    selectData
  > = {}
): UseWaitForTransactionReceiptReturnType<config, networkId, selectData> {
  const { hash, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = waitForTransactionReceiptQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(hash && (query.enabled ?? true));

  return useQuery({
    ...(query as any),
    ...options,
    enabled,
  }) as UseWaitForTransactionReceiptReturnType<config, networkId, selectData>;
}
