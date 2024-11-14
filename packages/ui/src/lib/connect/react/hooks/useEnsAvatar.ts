"use client";

import type {
  Config,
  GetEnsAvatarErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetEnsAvatarData,
  type GetEnsAvatarOptions,
  type GetEnsAvatarQueryFnData,
  type GetEnsAvatarQueryKey,
  getEnsAvatarQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseEnsAvatarParameters<
  config extends Config = Config,
  selectData = GetEnsAvatarData
> = Compute<
  GetEnsAvatarOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetEnsAvatarQueryFnData,
      GetEnsAvatarErrorType,
      selectData,
      GetEnsAvatarQueryKey<config>
    >
>;

export type UseEnsAvatarReturnType<selectData = GetEnsAvatarData> =
  UseQueryReturnType<selectData, GetEnsAvatarErrorType>;

/** https://wagmi.sh/react/api/hooks/useEnsAvatar */
export function useEnsAvatar<
  config extends Config = ResolvedRegister["config"],
  selectData = GetEnsAvatarData
>(
  parameters: UseEnsAvatarParameters<config, selectData> = {}
): UseEnsAvatarReturnType<selectData> {
  const { name, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getEnsAvatarQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(name && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
