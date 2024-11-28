import type { QueryOptions } from "@tanstack/query-core";

import {
  type GetGasPriceErrorType,
  type GetGasPriceParameters,
  type GetGasPriceReturnType,
  getGasPrice,
} from "../actions/getGasPrice";
import type { Config } from "../createConfig";
import type { ScopeKeyParameter } from "../types/properties";
import type { Compute, ExactPartial } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type GetGasPriceOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = Compute<
  ExactPartial<GetGasPriceParameters<config, networkId>> & ScopeKeyParameter
>;

export function getGasPriceQueryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(config: config, options: GetGasPriceOptions<config, networkId> = {}) {
  return {
    async queryFn({ queryKey }) {
      const { scopeKey: _, ...parameters } = queryKey[1];
      const gasPrice = await getGasPrice(config, parameters);
      return gasPrice ?? null;
    },
    queryKey: getGasPriceQueryKey(options),
  } as const satisfies QueryOptions<
    GetGasPriceQueryFnData,
    GetGasPriceErrorType,
    GetGasPriceData,
    GetGasPriceQueryKey<config, networkId>
  >;
}

export type GetGasPriceQueryFnData = GetGasPriceReturnType;

export type GetGasPriceData = GetGasPriceQueryFnData;

export function getGasPriceQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(options: GetGasPriceOptions<config, networkId> = {}) {
  return ["gasPrice", filterQueryOptions(options)] as const;
}

export type GetGasPriceQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = ReturnType<typeof getGasPriceQueryKey<config, networkId>>;
