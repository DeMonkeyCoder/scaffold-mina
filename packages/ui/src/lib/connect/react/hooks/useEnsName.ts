"use client";

import type {
  Config,
  GetEnsNameErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetEnsNameData,
  type GetEnsNameOptions,
  type GetEnsNameQueryFnData,
  type GetEnsNameQueryKey,
  getEnsNameQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseEnsNameParameters<
  config extends Config = Config,
  selectData = GetEnsNameData
> = Compute<
  GetEnsNameOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetEnsNameQueryFnData,
      GetEnsNameErrorType,
      selectData,
      GetEnsNameQueryKey<config>
    >
>;

export type UseEnsNameReturnType<selectData = GetEnsNameData> =
  UseQueryReturnType<selectData, GetEnsNameErrorType>;

/** https://wagmi.sh/react/api/hooks/useEnsName */
export function useEnsName<
  config extends Config = ResolvedRegister["config"],
  selectData = GetEnsNameData
>(
  parameters: UseEnsNameParameters<config, selectData> = {}
): UseEnsNameReturnType<selectData> {
  const { address, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getEnsNameQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(address && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
