"use client";

import type {
  Config,
  PrepareTransactionRequestErrorType,
  ResolvedRegister,
  SelectChains,
} from "@/lib/connect/core/exports";
import {
  type PrepareTransactionRequestData,
  type PrepareTransactionRequestOptions,
  type PrepareTransactionRequestQueryKey,
  prepareTransactionRequestQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { PrepareTransactionRequestQueryFnData } from "@/lib/connect/core/exports/query";
import type { PrepareTransactionRequestRequest as viem_PrepareTransactionRequestRequest } from "@/lib/connect/viem";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UsePrepareTransactionRequestParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  > = viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >,
  selectData = PrepareTransactionRequestData<config, networkId, request>
> = PrepareTransactionRequestOptions<config, networkId, request> &
  ConfigParameter<config> &
  QueryParameter<
    PrepareTransactionRequestQueryFnData<config, networkId, request>,
    PrepareTransactionRequestErrorType,
    selectData,
    PrepareTransactionRequestQueryKey<config, networkId, request>
  >;

export type UsePrepareTransactionRequestReturnType<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  > = viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >,
  selectData = PrepareTransactionRequestData<config, networkId, request>
> = UseQueryReturnType<selectData, PrepareTransactionRequestErrorType>;

/** https://wagmi.sh/react/api/hooks/usePrepareTransactionRequest */
export function usePrepareTransactionRequest<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  > = viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >,
  selectData = PrepareTransactionRequestData<config, networkId, request>
>(
  parameters: UsePrepareTransactionRequestParameters<
    config,
    networkId,
    request,
    selectData
  > = {} as any
): UsePrepareTransactionRequestReturnType<
  config,
  networkId,
  request,
  selectData
> {
  const { to, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = prepareTransactionRequestQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  } as PrepareTransactionRequestOptions<config, networkId, request>);
  const enabled = Boolean(to && (query.enabled ?? true));

  return useQuery({
    ...(query as any),
    ...options,
    enabled,
  }) as UsePrepareTransactionRequestReturnType<
    config,
    networkId,
    request,
    selectData
  >;
}
