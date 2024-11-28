"use client";

import type {
  Config,
  ReadContractsErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import {
  type InfiniteReadContractsQueryFnData,
  type InfiniteReadContractsQueryKey,
  infiniteReadContractsQueryOptions,
  structuralSharing,
} from "@/lib/connect/core/exports/query";
import type { ContractFunctionParameters } from "@/lib/connect/viem";

import type {
  InfiniteReadContractsData,
  InfiniteReadContractsOptions,
} from "../exports/query";
import type {
  ConfigParameter,
  InfiniteQueryParameter,
} from "../types/properties";
import {
  type UseInfiniteQueryParameters,
  type UseInfiniteQueryReturnType,
  useInfiniteQuery,
} from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseInfiniteContractReadsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config,
  pageParam = unknown,
  selectData = InfiniteReadContractsData<contracts, allowFailure>
> = InfiniteReadContractsOptions<contracts, allowFailure, pageParam, config> &
  ConfigParameter<config> &
  InfiniteQueryParameter<
    InfiniteReadContractsQueryFnData<contracts, allowFailure>,
    ReadContractsErrorType,
    selectData,
    InfiniteReadContractsData<contracts, allowFailure>,
    InfiniteReadContractsQueryKey<contracts, allowFailure, pageParam, config>,
    pageParam
  >;

export type UseInfiniteContractReadsReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  selectData = InfiniteReadContractsData<contracts, allowFailure>
> = UseInfiniteQueryReturnType<selectData, ReadContractsErrorType>;

/** https://wagmi.sh/react/api/hooks/useInfiniteReadContracts */
export function useInfiniteReadContracts<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister["config"],
  pageParam = unknown,
  selectData = InfiniteReadContractsData<contracts, allowFailure>
>(
  parameters: UseInfiniteContractReadsParameters<
    contracts,
    allowFailure,
    config,
    pageParam,
    selectData
  >
): UseInfiniteContractReadsReturnType<contracts, allowFailure, selectData> {
  const { contracts = [], query } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = infiniteReadContractsQueryOptions(config, {
    ...parameters,
    networkId,
    contracts: contracts as UseInfiniteContractReadsParameters["contracts"],
    query: query as UseInfiniteQueryParameters,
  });

  return useInfiniteQuery({
    ...(query as any),
    ...options,
    initialPageParam: options.initialPageParam,
    structuralSharing: query.structuralSharing ?? structuralSharing,
  });
}
