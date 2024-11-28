"use client";

import type {
  Config,
  ReadContractErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type { UnionCompute } from "@/lib/connect/core/exports/internal";
import {
  type ReadContractData,
  type ReadContractOptions,
  type ReadContractQueryFnData,
  type ReadContractQueryKey,
  readContractQueryOptions,
  structuralSharing,
} from "@/lib/connect/core/exports/query";
import type {
  Abi,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseReadContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "pure" | "view"
  > = ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<
    abi,
    "pure" | "view",
    functionName
  > = ContractFunctionArgs<abi, "pure" | "view", functionName>,
  config extends Config = Config,
  selectData = ReadContractData<abi, functionName, args>
> = UnionCompute<
  ReadContractOptions<abi, functionName, args, config> &
    ConfigParameter<config> &
    QueryParameter<
      ReadContractQueryFnData<abi, functionName, args>,
      ReadContractErrorType,
      selectData,
      ReadContractQueryKey<abi, functionName, args, config>
    >
>;

export type UseReadContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "pure" | "view"
  > = ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<
    abi,
    "pure" | "view",
    functionName
  > = ContractFunctionArgs<abi, "pure" | "view", functionName>,
  selectData = ReadContractData<abi, functionName, args>
> = UseQueryReturnType<selectData, ReadContractErrorType>;

/** https://wagmi.sh/react/api/hooks/useReadContract */
export function useReadContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<abi, "pure" | "view", functionName>,
  config extends Config = ResolvedRegister["config"],
  selectData = ReadContractData<abi, functionName, args>
>(
  parameters: UseReadContractParameters<
    abi,
    functionName,
    args,
    config,
    selectData
  > = {} as any
): UseReadContractReturnType<abi, functionName, args, selectData> {
  const { abi, address, functionName, query = {} } = parameters;

  const config = useConfig(parameters);
  const networkId = useNetworkId({ config });

  const options = readContractQueryOptions<config, abi, functionName, args>(
    config,
    { ...(parameters as any), networkId: parameters.networkId ?? networkId }
  );
  const enabled = Boolean(
    address && abi && functionName && (query.enabled ?? true)
  );

  return useQuery({
    ...query,
    ...options,
    enabled,
    structuralSharing: query.structuralSharing ?? structuralSharing,
  });
}
