"use client";

import type {
  CallErrorType,
  Config,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type CallData,
  type CallOptions,
  type CallQueryKey,
  callQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { CallQueryFnData } from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseCallParameters<
  config extends Config = Config,
  selectData = CallData
> = Compute<
  CallOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      CallQueryFnData,
      CallErrorType,
      selectData,
      CallQueryKey<config>
    >
>;

export type UseCallReturnType<selectData = CallData> = UseQueryReturnType<
  selectData,
  CallErrorType
>;

/** https://wagmi.sh/react/api/hooks/useCall */
export function useCall<
  config extends Config = ResolvedRegister["config"],
  selectData = CallData
>(
  parameters: UseCallParameters<config, selectData> = {}
): UseCallReturnType<selectData> {
  const { query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = callQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });

  return useQuery({ ...query, ...options });
}
