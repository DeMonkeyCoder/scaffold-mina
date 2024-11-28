"use client";

import type {
  Config,
  GetTransactionConfirmationsErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import {
  type GetTransactionConfirmationsData,
  type GetTransactionConfirmationsOptions,
  type GetTransactionConfirmationsQueryFnData,
  type GetTransactionConfirmationsQueryKey,
  getTransactionConfirmationsQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseTransactionConfirmationsParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = GetTransactionConfirmationsData
> = GetTransactionConfirmationsOptions<config, networkId> &
  ConfigParameter<config> &
  QueryParameter<
    GetTransactionConfirmationsQueryFnData,
    GetTransactionConfirmationsErrorType,
    selectData,
    GetTransactionConfirmationsQueryKey<config, networkId>
  >;

export type UseTransactionConfirmationsReturnType<
  selectData = GetTransactionConfirmationsData
> = UseQueryReturnType<selectData, GetTransactionConfirmationsErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransactionConfirmations */
export function useTransactionConfirmations<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = GetTransactionConfirmationsData
>(
  parameters: UseTransactionConfirmationsParameters<
    config,
    networkId,
    selectData
  > = {} as any
): UseTransactionConfirmationsReturnType<selectData> {
  const { hash, transactionReceipt, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = getTransactionConfirmationsQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(
    !(hash && transactionReceipt) &&
      (hash || transactionReceipt) &&
      (query.enabled ?? true)
  );

  return useQuery({ ...query, ...options, enabled });
}
