"use client";

import type {
  Config,
  ResolvedRegister,
  SimulateContractErrorType,
} from "@/lib/connect/core/exports";
import {
  type SimulateContractData,
  type SimulateContractOptions,
  type SimulateContractQueryFnData,
  type SimulateContractQueryKey,
  simulateContractQueryOptions,
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
import { useConnectorClient } from "./useConnectorClient";

export type UseSimulateContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "nonpayable" | "payable"
  > = ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  > = ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, networkId>
> = SimulateContractOptions<abi, functionName, args, config, networkId> &
  ConfigParameter<config> &
  QueryParameter<
    SimulateContractQueryFnData<abi, functionName, args, config, networkId>,
    SimulateContractErrorType,
    selectData,
    SimulateContractQueryKey<abi, functionName, args, config, networkId>
  >;

export type UseSimulateContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "nonpayable" | "payable"
  > = ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  > = ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, networkId>
> = UseQueryReturnType<selectData, SimulateContractErrorType>;

/** https://wagmi.sh/react/api/hooks/useSimulateContract */
export function useSimulateContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  >,
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, networkId>
>(
  parameters: UseSimulateContractParameters<
    abi,
    functionName,
    args,
    config,
    networkId,
    selectData
  > = {} as any
): UseSimulateContractReturnType<
  abi,
  functionName,
  args,
  config,
  networkId,
  selectData
> {
  const { abi, address, connector, functionName, query = {} } = parameters;

  const config = useConfig(parameters);
  const { data: connectorClient } = useConnectorClient({
    connector,
    query: { enabled: parameters.account === undefined },
  });
  const networkId = useNetworkId({ config });

  const options = simulateContractQueryOptions<
    config,
    abi,
    functionName,
    args,
    networkId
  >(config, {
    ...parameters,
    account: parameters.account ?? connectorClient?.account,
    networkId: parameters.networkId ?? networkId,
  });
  const enabled = Boolean(
    abi && address && functionName && (query.enabled ?? true)
  );

  return useQuery({ ...query, ...options, enabled });
}
