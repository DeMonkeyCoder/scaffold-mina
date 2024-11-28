import type { QueryOptions } from "@tanstack/query-core";

import type { PrepareTransactionRequestRequest as viem_PrepareTransactionRequestRequest } from "@/lib/connect/viem";

import {
  type PrepareTransactionRequestErrorType,
  type PrepareTransactionRequestParameters,
  type PrepareTransactionRequestReturnType,
  prepareTransactionRequest,
} from "../actions/prepareTransactionRequest";
import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type { ScopeKeyParameter } from "../types/properties";
import type { UnionExactPartial } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type PrepareTransactionRequestOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >
> = UnionExactPartial<
  PrepareTransactionRequestParameters<config, networkId, request>
> &
  ScopeKeyParameter;

export function prepareTransactionRequestQueryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >
>(
  config: config,
  options: PrepareTransactionRequestOptions<
    config,
    networkId,
    request
  > = {} as any
) {
  return {
    queryFn({ queryKey }) {
      const { scopeKey: _, to, ...parameters } = queryKey[1];
      if (!to) throw new Error("to is required");
      return prepareTransactionRequest(config, {
        to,
        ...(parameters as any),
      }) as unknown as Promise<
        PrepareTransactionRequestQueryFnData<config, networkId, request>
      >;
    },
    queryKey: prepareTransactionRequestQueryKey(options),
  } as const satisfies QueryOptions<
    PrepareTransactionRequestQueryFnData<config, networkId, request>,
    PrepareTransactionRequestErrorType,
    PrepareTransactionRequestData<config, networkId, request>,
    PrepareTransactionRequestQueryKey<config, networkId, request>
  >;
}

export type PrepareTransactionRequestQueryFnData<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >
> = PrepareTransactionRequestReturnType<config, networkId, request>;

export type PrepareTransactionRequestData<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >
> = PrepareTransactionRequestQueryFnData<config, networkId, request>;

export function prepareTransactionRequestQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >
>(options: PrepareTransactionRequestOptions<config, networkId, request>) {
  return ["prepareTransactionRequest", filterQueryOptions(options)] as const;
}

export type PrepareTransactionRequestQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >
> = ReturnType<
  typeof prepareTransactionRequestQueryKey<config, networkId, request>
>;
