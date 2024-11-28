import type { ContractFunctionParameters } from "@/lib/connect/viem";
import {
  type ReadContractsErrorType,
  type ReadContractsParameters,
  type ReadContractsReturnType,
  readContracts,
} from "../actions/readContracts";
import type { Config } from "../createConfig";
import type {
  NetworkIdParameter,
  ScopeKeyParameter,
} from "../types/properties";
import type { StrictOmit } from "../types/utils";
import type { InfiniteQueryOptions } from "./types";
import { filterQueryOptions } from "./utils";

export type InfiniteReadContractsOptions<
  contracts extends readonly unknown[],
  allowFailure extends boolean,
  pageParam,
  config extends Config
> = {
  cacheKey: string;
  contracts(
    pageParam: pageParam
  ): ReadContractsParameters<contracts, allowFailure, config>["contracts"];
} & StrictOmit<
  ReadContractsParameters<contracts, allowFailure, config>,
  "contracts"
> &
  ScopeKeyParameter;

export function infiniteReadContractsQueryOptions<
  config extends Config,
  const contracts extends readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  pageParam = unknown
>(
  config: config,
  options: InfiniteReadContractsOptions<
    contracts,
    allowFailure,
    pageParam,
    config
  > &
    NetworkIdParameter<config> &
    RequiredPageParamsParameters<contracts, allowFailure, pageParam>
) {
  return {
    ...options.query,
    async queryFn({ pageParam, queryKey }) {
      const { contracts } = options;
      const { cacheKey: _, scopeKey: _s, ...parameters } = queryKey[1];
      return (await readContracts(config, {
        ...parameters,
        contracts: contracts(pageParam as any),
      })) as ReadContractsReturnType<contracts, allowFailure>;
    },
    queryKey: infiniteReadContractsQueryKey(options),
  } as const satisfies InfiniteQueryOptions<
    InfiniteReadContractsQueryFnData<contracts, allowFailure>,
    ReadContractsErrorType,
    InfiniteReadContractsData<contracts, allowFailure>,
    InfiniteReadContractsData<contracts, allowFailure>,
    InfiniteReadContractsQueryKey<contracts, allowFailure, pageParam, config>,
    pageParam
  >;
}

type RequiredPageParamsParameters<
  contracts extends readonly unknown[],
  allowFailure extends boolean,
  pageParam
> = {
  query: {
    initialPageParam: pageParam;
    getNextPageParam(
      lastPage: InfiniteReadContractsQueryFnData<contracts, allowFailure>,
      allPages: InfiniteReadContractsQueryFnData<contracts, allowFailure>[],
      lastPageParam: pageParam,
      allPageParams: pageParam[]
    ): pageParam | undefined | null;
  };
};

export type InfiniteReadContractsQueryFnData<
  contracts extends readonly unknown[],
  allowFailure extends boolean
> = ReadContractsReturnType<contracts, allowFailure>;

export type InfiniteReadContractsData<
  contracts extends readonly unknown[],
  allowFailure extends boolean
> = InfiniteReadContractsQueryFnData<contracts, allowFailure>;

export function infiniteReadContractsQueryKey<
  config extends Config,
  const contracts extends readonly unknown[],
  allowFailure extends boolean,
  pageParam
>(
  options: InfiniteReadContractsOptions<
    contracts,
    allowFailure,
    pageParam,
    config
  > &
    NetworkIdParameter<config> &
    RequiredPageParamsParameters<contracts, allowFailure, pageParam>
) {
  const { contracts: _, query: _q, ...parameters } = options;
  return ["infiniteReadContracts", filterQueryOptions(parameters)] as const;
}

export type InfiniteReadContractsQueryKey<
  contracts extends readonly unknown[],
  allowFailure extends boolean,
  pageParam,
  config extends Config
> = ReturnType<
  typeof infiniteReadContractsQueryKey<
    config,
    contracts,
    allowFailure,
    pageParam
  >
>;
