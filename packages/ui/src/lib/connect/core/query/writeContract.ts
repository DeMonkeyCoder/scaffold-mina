import type { MutateOptions, MutationOptions } from "@tanstack/query-core";
import type {
  Abi,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";

import {
  type WriteContractErrorType,
  type WriteContractParameters,
  type WriteContractReturnType,
  writeContract,
} from "../actions/writeContract";
import type { Config } from "../createConfig";
import type { Compute } from "../types/utils";

export function writeContractMutationOptions<config extends Config>(
  config: config
) {
  return {
    mutationFn(variables) {
      return writeContract(config, variables);
    },
    mutationKey: ["writeContract"],
  } as const satisfies MutationOptions<
    WriteContractData,
    WriteContractErrorType,
    WriteContractVariables<
      Abi,
      string,
      readonly unknown[],
      config,
      config["chains"][number]["id"]
    >
  >;
}

export type WriteContractData = Compute<WriteContractReturnType>;

export type WriteContractVariables<
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  >,
  config extends Config,
  networkId extends config["chains"][number]["id"],
  ///
  allFunctionNames = ContractFunctionName<abi, "nonpayable" | "payable">
> = WriteContractParameters<
  abi,
  functionName,
  args,
  config,
  networkId,
  allFunctionNames
>;

export type WriteContractMutate<config extends Config, context = unknown> = <
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  >,
  networkId extends config["chains"][number]["id"]
>(
  variables: WriteContractVariables<abi, functionName, args, config, networkId>,
  options?:
    | MutateOptions<
        WriteContractData,
        WriteContractErrorType,
        WriteContractVariables<
          abi,
          functionName,
          args,
          config,
          networkId,
          // use `functionName` to make sure it's not union of all possible function names
          functionName
        >,
        context
      >
    | undefined
) => void;

export type WriteContractMutateAsync<
  config extends Config,
  context = unknown
> = <
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  >,
  networkId extends config["chains"][number]["id"]
>(
  variables: WriteContractVariables<abi, functionName, args, config, networkId>,
  options?:
    | MutateOptions<
        WriteContractData,
        WriteContractErrorType,
        WriteContractVariables<
          abi,
          functionName,
          args,
          config,
          networkId,
          // use `functionName` to make sure it's not union of all possible function names
          functionName
        >,
        context
      >
    | undefined
) => Promise<WriteContractData>;
