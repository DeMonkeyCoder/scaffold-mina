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
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseTransactionConfirmationsParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = GetTransactionConfirmationsData
> = GetTransactionConfirmationsOptions<config, chainId> &
  ConfigParameter<config> &
  QueryParameter<
    GetTransactionConfirmationsQueryFnData,
    GetTransactionConfirmationsErrorType,
    selectData,
    GetTransactionConfirmationsQueryKey<config, chainId>
  >;

export type UseTransactionConfirmationsReturnType<
  selectData = GetTransactionConfirmationsData
> = UseQueryReturnType<selectData, GetTransactionConfirmationsErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransactionConfirmations */
export function useTransactionConfirmations<
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = GetTransactionConfirmationsData
>(
  parameters: UseTransactionConfirmationsParameters<
    config,
    chainId,
    selectData
  > = {} as any
): UseTransactionConfirmationsReturnType<selectData> {
  const { hash, transactionReceipt, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getTransactionConfirmationsQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(
    !(hash && transactionReceipt) &&
      (hash || transactionReceipt) &&
      (query.enabled ?? true)
  );

  return useQuery({ ...query, ...options, enabled });
}
