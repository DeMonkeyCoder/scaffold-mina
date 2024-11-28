import type { QueryOptions } from "@tanstack/query-core";
import type {
  ContractFunctionParameters,
  MulticallParameters as viem_MulticallParameters,
} from "@/lib/connect/viem";

import {
  type ReadContractsErrorType,
  type ReadContractsReturnType,
  readContracts,
} from "../actions/readContracts";
import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import type { ScopeKeyParameter } from "../types/properties";
import type { ExactPartial } from "../types/utils";
import { filterQueryOptions } from "./utils";

export type ReadContractsOptions<
  contracts extends readonly unknown[],
  allowFailure extends boolean,
  config extends Config
> = ExactPartial<
  viem_MulticallParameters<
    contracts,
    allowFailure,
    { optional: true; properties: NetworkIdParameter<config> }
  >
> &
  ScopeKeyParameter;

export function readContractsQueryOptions<
  config extends Config,
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true
>(
  config: config,
  options: ReadContractsOptions<contracts, allowFailure, config> &
    NetworkIdParameter<config> = {}
) {
  return {
    async queryFn({ queryKey }) {
      const contracts: ContractFunctionParameters[] = [];
      const length = queryKey[1].contracts.length;
      for (let i = 0; i < length; i++) {
        const contract = queryKey[1].contracts[i]!;
        const abi = (options.contracts?.[i] as ContractFunctionParameters).abi;
        contracts.push({ ...contract, abi });
      }
      const { scopeKey: _, ...parameters } = queryKey[1];
      return readContracts(config, {
        ...parameters,
        contracts,
      }) as Promise<ReadContractsReturnType<contracts, allowFailure>>;
    },
    queryKey: readContractsQueryKey(options),
  } as const satisfies QueryOptions<
    ReadContractsQueryFnData<contracts, allowFailure>,
    ReadContractsErrorType,
    ReadContractsData<contracts, allowFailure>,
    ReadContractsQueryKey<contracts, allowFailure, config>
  >;
}

export type ReadContractsQueryFnData<
  contracts extends readonly unknown[],
  allowFailure extends boolean
> = ReadContractsReturnType<contracts, allowFailure>;

export type ReadContractsData<
  contracts extends readonly unknown[],
  allowFailure extends boolean
> = ReadContractsQueryFnData<contracts, allowFailure>;

export function readContractsQueryKey<
  config extends Config,
  const contracts extends readonly unknown[],
  allowFailure extends boolean
>(
  options: ReadContractsOptions<contracts, allowFailure, config> &
    NetworkIdParameter<config> = {}
) {
  const contracts = [];
  for (const contract of (options.contracts ??
    []) as (ContractFunctionParameters & { networkId: string })[]) {
    const { abi: _, ...rest } = contract;
    contracts.push({ ...rest, networkId: rest.networkId ?? options.networkId });
  }
  return [
    "readContracts",
    filterQueryOptions({ ...options, contracts }),
  ] as const;
}

export type ReadContractsQueryKey<
  contracts extends readonly unknown[],
  allowFailure extends boolean,
  config extends Config
> = ReturnType<typeof readContractsQueryKey<config, contracts, allowFailure>>;
