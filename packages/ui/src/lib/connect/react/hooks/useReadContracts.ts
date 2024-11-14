"use client";

import type {
  Config,
  ReadContractsErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type ReadContractsData,
  type ReadContractsOptions,
  type ReadContractsQueryFnData,
  type ReadContractsQueryKey,
  readContractsQueryOptions,
  structuralSharing,
} from "@/lib/connect/core/exports/query";
import { useMemo } from "react";
import type { ContractFunctionParameters } from "@/lib/connect/viem";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseReadContractsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config,
  selectData = ReadContractsData<contracts, allowFailure>
> = Compute<
  ReadContractsOptions<contracts, allowFailure, config> &
    ConfigParameter<config> &
    QueryParameter<
      ReadContractsQueryFnData<contracts, allowFailure>,
      ReadContractsErrorType,
      selectData,
      ReadContractsQueryKey<contracts, allowFailure, config>
    >
>;

export type UseReadContractsReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  selectData = ReadContractsData<contracts, allowFailure>
> = UseQueryReturnType<selectData, ReadContractsErrorType>;

/** https://wagmi.sh/react/api/hooks/useReadContracts */
export function useReadContracts<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister["config"],
  selectData = ReadContractsData<contracts, allowFailure>
>(
  parameters: UseReadContractsParameters<
    contracts,
    allowFailure,
    config,
    selectData
  > = {}
): UseReadContractsReturnType<contracts, allowFailure, selectData> {
  const { contracts = [], query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = readContractsQueryOptions<config, contracts, allowFailure>(
    config,
    { ...parameters, chainId }
  );

  const enabled = useMemo(() => {
    let isContractsValid = false;
    for (const contract of contracts) {
      const { abi, address, functionName } =
        contract as ContractFunctionParameters;
      if (!abi || !address || !functionName) {
        isContractsValid = false;
        break;
      }
      isContractsValid = true;
    }
    return Boolean(isContractsValid && (query.enabled ?? true));
  }, [contracts, query.enabled]);

  return useQuery({
    ...options,
    ...query,
    enabled,
    structuralSharing: query.structuralSharing ?? structuralSharing,
  });
}
