import type {
  Config,
  ResolvedRegister,
  SimulateContractErrorType,
  SimulateContractParameters,
} from "@/lib/connect/core/exports";
import type {
  ScopeKeyParameter,
  UnionExactPartial,
} from "@/lib/connect/core/exports/internal";
import type {
  SimulateContractData,
  SimulateContractQueryFnData,
  SimulateContractQueryKey,
} from "@/lib/connect/core/exports/query";
import type {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";

import type { ConfigParameter, QueryParameter } from "../../types/properties";
import { useAccount } from "../useAccount";
import { useNetworkId } from "../useNetworkId";
import { useConfig } from "../useConfig";
import {
  useSimulateContract,
  type UseSimulateContractReturnType,
} from "../useSimulateContract";

type stateMutability = "nonpayable" | "payable";

export type CreateUseSimulateContractParameters<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined
> = {
  abi: abi | Abi | readonly unknown[];
  address?: address | Address | Record<string, Address> | undefined;
  functionName?:
    | functionName
    | ContractFunctionName<abi, stateMutability>
    | undefined;
};

export type CreateUseSimulateContractReturnType<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined,
  functionName extends ContractFunctionName<abi, stateMutability> | undefined
> = <
  name extends functionName extends ContractFunctionName<abi, stateMutability>
    ? functionName
    : ContractFunctionName<abi, stateMutability>,
  args extends ContractFunctionArgs<abi, stateMutability, name>,
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = SimulateContractData<abi, name, args, config, networkId>
>(
  parameters?: {
    abi?: undefined;
    address?: address extends undefined ? Address : undefined;
    functionName?: functionName extends undefined ? name : undefined;
    networkId?: address extends Record<string, Address>
      ?
          | keyof address
          | (networkId extends keyof address ? networkId : never)
          | undefined
      : networkId | number | undefined;
  } & UnionExactPartial<
    // TODO: Take `abi` and `address` from above and omit from below (currently breaks inference)
    SimulateContractParameters<abi, name, args, config, networkId>
  > &
    ScopeKeyParameter &
    ConfigParameter<config> &
    QueryParameter<
      SimulateContractQueryFnData<abi, name, args, config, networkId>,
      SimulateContractErrorType,
      selectData,
      SimulateContractQueryKey<abi, name, args, config, networkId>
    >
) => UseSimulateContractReturnType<
  abi,
  name,
  args,
  config,
  networkId,
  selectData
>;

export function createUseSimulateContract<
  const abi extends Abi | readonly unknown[],
  const address extends
    | Address
    | Record<string, Address>
    | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined
>(
  props: CreateUseSimulateContractParameters<abi, address, functionName>
): CreateUseSimulateContractReturnType<abi, address, functionName> {
  if (props.address !== undefined && typeof props.address === "object")
    return (parameters) => {
      const config = useConfig(parameters);
      const configNetworkId = useNetworkId({ config });
      const account = useAccount({ config });
      const networkId =
        (parameters as { networkId?: string })?.networkId ??
        account.networkId ??
        configNetworkId;
      return useSimulateContract({
        ...(parameters as any),
        ...(props.functionName ? { functionName: props.functionName } : {}),
        address: (props.address as Record<string, Address> | undefined)?.[
          networkId
        ],
        abi: props.abi,
      });
    };

  return (parameters) => {
    return useSimulateContract({
      ...(parameters as any),
      ...(props.address ? { address: props.address } : {}),
      ...(props.functionName ? { functionName: props.functionName } : {}),
      abi: props.abi,
    });
  };
}
