"use client";

import type {
  Config,
  GetBytecodeErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type GetBytecodeData,
  type GetBytecodeOptions,
  type GetBytecodeQueryKey,
  getBytecodeQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { GetBytecodeQueryFnData } from "@/lib/connect/core/exports/query";
import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseBytecodeParameters<
  config extends Config = Config,
  selectData = GetBytecodeData
> = Compute<
  GetBytecodeOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetBytecodeQueryFnData,
      GetBytecodeErrorType,
      selectData,
      GetBytecodeQueryKey<config>
    >
>;

export type UseBytecodeReturnType<selectData = GetBytecodeData> =
  UseQueryReturnType<selectData, GetBytecodeErrorType>;

/** https://wagmi.sh/react/api/hooks/useBytecode */
export function useBytecode<
  config extends Config = ResolvedRegister["config"],
  selectData = GetBytecodeData
>(
  parameters: UseBytecodeParameters<config, selectData> = {}
): UseBytecodeReturnType<selectData> {
  const { address, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = getBytecodeQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(address && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
