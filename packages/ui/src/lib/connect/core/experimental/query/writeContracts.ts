import type { MutateOptions, MutationOptions } from "@tanstack/query-core";

import type { Config } from "../../createConfig";
import type { Compute } from "../../types/utils";
import {
  type WriteContractsErrorType,
  type WriteContractsParameters,
  type WriteContractsReturnType,
  writeContracts,
} from "../actions/writeContracts";

export function writeContractsMutationOptions<
  const contracts extends readonly unknown[],
  config extends Config
>(config: config) {
  return {
    mutationFn(variables) {
      return writeContracts(config, variables as any) as any;
    },
    mutationKey: ["writeContracts"],
  } as const satisfies MutationOptions<
    WriteContractsData,
    WriteContractsErrorType,
    WriteContractsVariables<contracts, config, config["chains"][number]["id"]>
  >;
}

export type WriteContractsData = Compute<WriteContractsReturnType>;

export type WriteContractsVariables<
  contracts extends readonly unknown[],
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = WriteContractsParameters<contracts, config, networkId>;

export type WriteContractsMutate<
  contracts extends readonly unknown[],
  config extends Config,
  context = unknown
> = <networkId extends config["chains"][number]["id"]>(
  variables: WriteContractsVariables<contracts, config, networkId>,
  options?:
    | Compute<
        MutateOptions<
          WriteContractsData,
          WriteContractsErrorType,
          Compute<WriteContractsVariables<contracts, config, networkId>>,
          context
        >
      >
    | undefined
) => void;

export type WriteContractsMutateAsync<
  contracts extends readonly unknown[],
  config extends Config,
  context = unknown
> = <networkId extends config["chains"][number]["id"]>(
  variables: WriteContractsVariables<contracts, config, networkId>,
  options?:
    | Compute<
        MutateOptions<
          WriteContractsData,
          WriteContractsErrorType,
          Compute<WriteContractsVariables<contracts, config, networkId>>,
          context
        >
      >
    | undefined
) => Promise<WriteContractsData>;
