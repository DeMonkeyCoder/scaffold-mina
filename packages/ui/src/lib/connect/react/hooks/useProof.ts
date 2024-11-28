"use client";

import type {
  Config,
  GetProofErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetProofData,
  type GetProofOptions,
  type GetProofQueryKey,
  getProofQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { GetProofQueryFnData } from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseProofParameters<
  config extends Config = Config,
  selectData = GetProofData
> = Compute<
  GetProofOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetProofQueryFnData,
      GetProofErrorType,
      selectData,
      GetProofQueryKey<config>
    >
>;

export type UseProofReturnType<selectData = GetProofData> = UseQueryReturnType<
  selectData,
  GetProofErrorType
>;

/** https://wagmi.sh/react/api/hooks/useProof */
export function useProof<
  config extends Config = ResolvedRegister["config"],
  selectData = GetProofData
>(
  parameters: UseProofParameters<config, selectData> = {}
): UseProofReturnType<selectData> {
  const { address, storageKeys, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = getProofQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(address && storageKeys && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
