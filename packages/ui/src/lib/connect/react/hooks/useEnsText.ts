"use client";

import type {
  Config,
  GetEnsTextErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetEnsTextData,
  type GetEnsTextOptions,
  type GetEnsTextQueryFnData,
  type GetEnsTextQueryKey,
  getEnsTextQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseEnsTextParameters<
  config extends Config = Config,
  selectData = GetEnsTextData
> = Compute<
  GetEnsTextOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetEnsTextQueryFnData,
      GetEnsTextErrorType,
      selectData,
      GetEnsTextQueryKey<config>
    >
>;

export type UseEnsTextReturnType<selectData = GetEnsTextData> =
  UseQueryReturnType<selectData, GetEnsTextErrorType>;

/** https://wagmi.sh/react/api/hooks/useEnsText */
export function useEnsText<
  config extends Config = ResolvedRegister["config"],
  selectData = GetEnsTextData
>(
  parameters: UseEnsTextParameters<config, selectData> = {}
): UseEnsTextReturnType<selectData> {
  const { key, name, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getEnsTextQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(key && name && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
