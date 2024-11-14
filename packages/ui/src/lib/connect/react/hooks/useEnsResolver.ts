"use client";

import type {
  Config,
  GetEnsResolverErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetEnsResolverData,
  type GetEnsResolverOptions,
  type GetEnsResolverQueryFnData,
  type GetEnsResolverQueryKey,
  getEnsResolverQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseEnsResolverParameters<
  config extends Config = Config,
  selectData = GetEnsResolverData
> = Compute<
  GetEnsResolverOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetEnsResolverQueryFnData,
      GetEnsResolverErrorType,
      selectData,
      GetEnsResolverQueryKey<config>
    >
>;

export type UseEnsResolverReturnType<selectData = GetEnsResolverData> =
  UseQueryReturnType<selectData, GetEnsResolverErrorType>;

/** https://wagmi.sh/react/api/hooks/useEnsResolver */
export function useEnsResolver<
  config extends Config = ResolvedRegister["config"],
  selectData = GetEnsResolverData
>(
  parameters: UseEnsResolverParameters<config, selectData> = {}
): UseEnsResolverReturnType<selectData> {
  const { name, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getEnsResolverQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(name && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
