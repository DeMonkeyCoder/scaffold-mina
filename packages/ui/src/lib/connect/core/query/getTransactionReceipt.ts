import type { QueryOptions } from "@tanstack/query-core";

import {
  type GetTransactionReceiptErrorType,
  type GetTransactionReceiptParameters,
  getTransactionReceipt,
} from "../actions/getTransactionReceipt";
import type { GetTransactionReceiptReturnType } from "../actions/getTransactionReceipt";
import type { Config } from "../createConfig";
import type { ScopeKeyParameter } from "../types/properties";
import type { Compute, ExactPartial } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type GetTransactionReceiptOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = Compute<
  ExactPartial<GetTransactionReceiptParameters<config, networkId>> &
    ScopeKeyParameter
>;

export function getTransactionReceiptQueryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  options: GetTransactionReceiptOptions<config, networkId> = {}
) {
  return {
    queryFn({ queryKey }) {
      const { hash, scopeKey: _, ...parameters } = queryKey[1];
      if (!hash) throw new Error("hash is required");
      return getTransactionReceipt(config, { ...parameters, hash });
    },
    queryKey: getTransactionReceiptQueryKey(options),
  } as const satisfies QueryOptions<
    GetTransactionReceiptQueryFnData<config, networkId>,
    GetTransactionReceiptErrorType,
    GetTransactionReceiptData<config, networkId>,
    GetTransactionReceiptQueryKey<config, networkId>
  >;
}

export type GetTransactionReceiptQueryFnData<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = GetTransactionReceiptReturnType<config, networkId>;

export type GetTransactionReceiptData<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = GetTransactionReceiptQueryFnData<config, networkId>;

export function getTransactionReceiptQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(options: GetTransactionReceiptOptions<config, networkId>) {
  return ["getTransactionReceipt", filterQueryOptions(options)] as const;
}

export type GetTransactionReceiptQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = ReturnType<typeof getTransactionReceiptQueryKey<config, networkId>>;
