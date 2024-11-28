import type { QueryOptions } from "@tanstack/query-core";

import {
  type EstimateGasErrorType,
  type EstimateGasParameters,
  type EstimateGasReturnType,
  estimateGas,
} from "../actions/estimateGas";
import type { Config } from "../createConfig";
import type { ScopeKeyParameter } from "../types/properties";
import type { UnionExactPartial } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type EstimateGasOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined
> = UnionExactPartial<EstimateGasParameters<config, networkId>> &
  ScopeKeyParameter;

export function estimateGasQueryOptions<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(config: config, options: EstimateGasOptions<config, networkId> = {} as any) {
  return {
    async queryFn({ queryKey }) {
      const { connector } = options;
      const { account, scopeKey: _, ...parameters } = queryKey[1];
      if (!account && !connector)
        throw new Error("account or connector is required");
      return estimateGas(config, {
        account,
        connector,
        ...(parameters as any),
      });
    },
    queryKey: estimateGasQueryKey(options),
  } as const satisfies QueryOptions<
    EstimateGasQueryFnData,
    EstimateGasErrorType,
    EstimateGasData,
    EstimateGasQueryKey<config, networkId>
  >;
}

export type EstimateGasQueryFnData = EstimateGasReturnType;

export type EstimateGasData = EstimateGasQueryFnData;

export function estimateGasQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined
>(options: EstimateGasOptions<config, networkId> = {} as any) {
  const { connector: _, ...rest } = options;
  return ["estimateGas", filterQueryOptions(rest)] as const;
}

export type EstimateGasQueryKey<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined
> = ReturnType<typeof estimateGasQueryKey<config, networkId>>;
