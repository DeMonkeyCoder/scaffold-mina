import type { MutateOptions, MutationOptions } from "@tanstack/query-core";
import type { Abi, ContractConstructorArgs } from "@/lib/connect/viem";

import {
  type DeployContractErrorType,
  type DeployContractParameters,
  type DeployContractReturnType,
  deployContract,
} from "../actions/deployContract";
import type { Config } from "../createConfig";
import type { Compute } from "../types/utils";

export function deployContractMutationOptions<config extends Config>(
  config: config
) {
  return {
    mutationFn(variables) {
      return deployContract(config, variables);
    },
    mutationKey: ["deployContract"],
  } as const satisfies MutationOptions<
    DeployContractData,
    DeployContractErrorType,
    DeployContractVariables<Abi, config, config["chains"][number]["id"]>
  >;
}

export type DeployContractData = Compute<DeployContractReturnType>;

export type DeployContractVariables<
  abi extends Abi | readonly unknown[],
  config extends Config,
  chainId extends config["chains"][number]["id"],
  ///
  allArgs = ContractConstructorArgs<abi>
> = DeployContractParameters<abi, config, chainId, allArgs>;

export type DeployContractMutate<config extends Config, context = unknown> = <
  abi extends Abi | readonly unknown[],
  chainId extends config["chains"][number]["id"]
>(
  variables: DeployContractVariables<abi, config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          DeployContractData,
          DeployContractErrorType,
          Compute<DeployContractVariables<abi, config, chainId>>,
          context
        >
      >
    | undefined
) => void;

export type DeployContractMutateAsync<
  config extends Config,
  context = unknown
> = <
  abi extends Abi | readonly unknown[],
  chainId extends config["chains"][number]["id"]
>(
  variables: DeployContractVariables<abi, config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          DeployContractData,
          DeployContractErrorType,
          Compute<DeployContractVariables<abi, config, chainId>>,
          context
        >
      >
    | undefined
) => Promise<DeployContractData>;
