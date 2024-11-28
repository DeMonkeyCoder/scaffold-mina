import type { QueryOptions } from "@tanstack/query-core";

import {
  type GetTransactionErrorType,
  type GetTransactionParameters,
  type GetTransactionReturnType,
  getTransaction,
} from "../actions/getTransaction";
import type { Config } from "../createConfig";
import type { ScopeKeyParameter } from "../types/properties";
import type { Compute, ExactPartial } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type GetTransactionOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = Compute<
  ExactPartial<GetTransactionParameters<config, networkId>> & ScopeKeyParameter
>;

export function getTransactionQueryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(config: config, options: GetTransactionOptions<config, networkId> = {}) {
  return {
    async queryFn({ queryKey }) {
      const { blockHash, blockNumber, blockTag, hash, index } = queryKey[1];
      if (!blockHash && !blockNumber && !blockTag && !hash)
        throw new Error(
          "blockHash, blockNumber, blockTag, or hash is required"
        );
      if (!hash && !index)
        throw new Error(
          "index is required for blockHash, blockNumber, or blockTag"
        );
      const { scopeKey: _, ...rest } = queryKey[1];
      return getTransaction(
        config,
        rest as GetTransactionParameters
      ) as unknown as Promise<GetTransactionQueryFnData<config, networkId>>;
    },
    queryKey: getTransactionQueryKey(options),
  } as const satisfies QueryOptions<
    GetTransactionQueryFnData<config, networkId>,
    GetTransactionErrorType,
    GetTransactionData<config, networkId>,
    GetTransactionQueryKey<config, networkId>
  >;
}

export type GetTransactionQueryFnData<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = GetTransactionReturnType<config, networkId>;

export type GetTransactionData<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = GetTransactionQueryFnData<config, networkId>;

export function getTransactionQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(options: GetTransactionOptions<config, networkId> = {}) {
  return ["transaction", filterQueryOptions(options)] as const;
}

export type GetTransactionQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = ReturnType<typeof getTransactionQueryKey<config, networkId>>;
