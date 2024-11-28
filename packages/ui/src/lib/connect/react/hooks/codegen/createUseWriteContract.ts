import type { MutateOptions } from "@tanstack/react-query";
import type {
  Config,
  ResolvedRegister,
  WriteContractErrorType,
} from "@/lib/connect/core/exports";
import type {
  NetworkIdParameter,
  Compute,
  ConnectorParameter,
  SelectChains,
  UnionCompute,
  UnionStrictOmit,
} from "@/lib/connect/core/exports/internal";
import type {
  WriteContractData,
  WriteContractVariables,
} from "@/lib/connect/core/exports/query";
import { useCallback } from "react";
import type {
  Abi,
  Account,
  Address,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";
import type { WriteContractParameters as viem_WriteContractParameters } from "@/lib/connect/viem/actions";

import { useAccount } from "../useAccount";
import { useNetworkId } from "../useNetworkId";
import { useConfig } from "../useConfig";
import {
  useWriteContract,
  type UseWriteContractParameters,
  type UseWriteContractReturnType as wagmi_UseWriteContractReturnType,
} from "../useWriteContract";

type stateMutability = "nonpayable" | "payable";

export type CreateUseWriteContractParameters<
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

export type CreateUseWriteContractReturnType<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined,
  functionName extends ContractFunctionName<abi, stateMutability> | undefined
> = <config extends Config = ResolvedRegister["config"], context = unknown>(
  parameters?: UseWriteContractParameters<config, context>
) => Compute<
  Omit<
    wagmi_UseWriteContractReturnType<config, context>,
    "writeContract" | "writeContractAsync"
  > & {
    writeContract: <
      const abi2 extends abi,
      name extends functionName extends ContractFunctionName<
        abi,
        stateMutability
      >
        ? functionName
        : ContractFunctionName<abi, stateMutability>,
      args extends ContractFunctionArgs<abi2, stateMutability, name>,
      networkId extends config["chains"][number]["id"]
    >(
      variables: Variables<
        abi2,
        functionName,
        name,
        args,
        config,
        networkId,
        address
      >,
      options?:
        | MutateOptions<
            WriteContractData,
            WriteContractErrorType,
            WriteContractVariables<
              abi2,
              name,
              args,
              config,
              networkId,
              // use `functionName` to make sure it's not union of all possible function names
              name
            >,
            context
          >
        | undefined
    ) => void;
    writeContractAsync: <
      const abi2 extends abi,
      name extends functionName extends ContractFunctionName<
        abi,
        stateMutability
      >
        ? functionName
        : ContractFunctionName<abi, stateMutability>,
      args extends ContractFunctionArgs<abi2, stateMutability, name>,
      networkId extends config["chains"][number]["id"]
    >(
      variables: Variables<
        abi2,
        functionName,
        name,
        args,
        config,
        networkId,
        address
      >,
      options?:
        | MutateOptions<
            WriteContractData,
            WriteContractErrorType,
            WriteContractVariables<
              abi2,
              name,
              args,
              config,
              networkId,
              // use `functionName` to make sure it's not union of all possible function names
              name
            >,
            context
          >
        | undefined
    ) => Promise<WriteContractData>;
  }
>;

export function createUseWriteContract<
  const abi extends Abi | readonly unknown[],
  const address extends
    | Address
    | Record<string, Address>
    | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined
>(
  props: CreateUseWriteContractParameters<abi, address, functionName>
): CreateUseWriteContractReturnType<abi, address, functionName> {
  if (props.address !== undefined && typeof props.address === "object")
    return (parameters) => {
      const config = useConfig(parameters);
      const result = useWriteContract(parameters);
      const configNetworkId = useNetworkId({ config });
      const account = useAccount({ config });
      type Args = Parameters<wagmi_UseWriteContractReturnType["writeContract"]>;
      return {
        ...(result as any),
        writeContract: useCallback(
          (...args: Args) => {
            let networkId: string | undefined;
            if (args[0].networkId) networkId = args[0].networkId;
            else if (args[0].account && args[0].account === account.address)
              networkId = account.networkId;
            else if (args[0].account === undefined)
              networkId = account.networkId;
            else networkId = configNetworkId;

            const variables = {
              ...(args[0] as any),
              address: networkId
                ? (props.address as Record<string, Address> | undefined)?.[
                    networkId
                  ]
                : undefined,
              ...(props.functionName
                ? { functionName: props.functionName }
                : {}),
              abi: props.abi,
            };
            result.writeContract(variables, args[1] as any);
          },
          [
            account.address,
            account.networkId,
            props,
            configNetworkId,
            result.writeContract,
          ]
        ),
        writeContractAsync: useCallback(
          (...args: Args) => {
            let networkId: string | undefined;
            if (args[0].networkId) networkId = args[0].networkId;
            else if (args[0].account && args[0].account === account.address)
              networkId = account.networkId;
            else if (args[0].account === undefined)
              networkId = account.networkId;
            else networkId = configNetworkId;

            const variables = {
              ...(args[0] as any),
              address: networkId
                ? (props.address as Record<string, Address> | undefined)?.[
                    networkId
                  ]
                : undefined,
              ...(props.functionName
                ? { functionName: props.functionName }
                : {}),
              abi: props.abi,
            };
            return result.writeContractAsync(variables, args[1] as any);
          },
          [
            account.address,
            account.networkId,
            props,
            configNetworkId,
            result.writeContractAsync,
          ]
        ),
      };
    };

  return (parameters) => {
    const result = useWriteContract(parameters);
    type Args = Parameters<wagmi_UseWriteContractReturnType["writeContract"]>;
    return {
      ...(result as any),
      writeContract: useCallback(
        (...args: Args) => {
          const variables = {
            ...(args[0] as any),
            ...(props.address ? { address: props.address } : {}),
            ...(props.functionName ? { functionName: props.functionName } : {}),
            abi: props.abi,
          };
          result.writeContract(variables, args[1] as any);
        },
        [props, result.writeContract]
      ),
      writeContractAsync: useCallback(
        (...args: Args) => {
          const variables = {
            ...(args[0] as any),
            ...(props.address ? { address: props.address } : {}),
            ...(props.functionName ? { functionName: props.functionName } : {}),
            abi: props.abi,
          };
          return result.writeContractAsync(variables, args[1] as any);
        },
        [props, result.writeContractAsync]
      ),
    };
  };
}

type Variables<
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, stateMutability> | undefined,
  name extends ContractFunctionName<abi, stateMutability>,
  args extends ContractFunctionArgs<abi, stateMutability, name>,
  config extends Config,
  networkId extends config["chains"][number]["id"],
  address extends Address | Record<string, Address> | undefined,
  ///
  allFunctionNames = ContractFunctionName<abi, stateMutability>,
  chains extends readonly Chain[] = SelectChains<config, networkId>,
  omittedProperties extends "abi" | "address" | "functionName" =
    | "abi"
    | (address extends undefined ? never : "address")
    | (functionName extends undefined ? never : "functionName")
> = UnionCompute<
  {
    [key in keyof chains]: UnionStrictOmit<
      viem_WriteContractParameters<
        abi,
        name,
        args,
        chains[key],
        Account,
        chains[key],
        allFunctionNames
      >,
      omittedProperties | "chain"
    >;
  }[number] &
    (address extends Record<string, Address>
      ? {
          networkId?:
            | keyof address
            | (networkId extends keyof address ? networkId : never)
            | undefined;
        }
      : Compute<NetworkIdParameter<config, networkId>>) &
    ConnectorParameter & { __mode?: "prepared" }
>;
