"use client";

import type {
  Config,
  GetStorageAtErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetStorageAtData,
  type GetStorageAtOptions,
  type GetStorageAtQueryKey,
  getStorageAtQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { GetStorageAtQueryFnData } from "@/lib/connect/core/exports/query";
import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseStorageAtParameters<
  config extends Config = Config,
  selectData = GetStorageAtData
> = Compute<
  GetStorageAtOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetStorageAtQueryFnData,
      GetStorageAtErrorType,
      selectData,
      GetStorageAtQueryKey<config>
    >
>;

export type UseStorageAtReturnType<selectData = GetStorageAtData> =
  UseQueryReturnType<selectData, GetStorageAtErrorType>;

/** https://wagmi.sh/react/api/hooks/useStorageAt */
export function useStorageAt<
  config extends Config = ResolvedRegister["config"],
  selectData = GetStorageAtData
>(
  parameters: UseStorageAtParameters<config, selectData> = {}
): UseStorageAtReturnType<selectData> {
  const { address, slot, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = getStorageAtQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(address && slot && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
