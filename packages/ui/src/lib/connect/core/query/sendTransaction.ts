import type { MutateOptions, MutationOptions } from "@tanstack/query-core";

import {
  type SendTransactionErrorType,
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from "../actions/sendTransaction";
import type { Config } from "../createConfig";
import type { Compute } from "../types/utils";

export function sendTransactionMutationOptions<config extends Config>(
  config: config
) {
  return {
    mutationFn(variables) {
      return sendTransaction(config, variables);
    },
    mutationKey: ["sendTransaction"],
  } as const satisfies MutationOptions<
    SendTransactionData,
    SendTransactionErrorType,
    SendTransactionVariables<config, config["chains"][number]["id"]>
  >;
}

export type SendTransactionData = Compute<SendTransactionReturnType>;

export type SendTransactionVariables<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = SendTransactionParameters<config, networkId>;

export type SendTransactionMutate<config extends Config, context = unknown> = <
  networkId extends config["chains"][number]["id"]
>(
  variables: SendTransactionVariables<config, networkId>,
  options?:
    | Compute<
        MutateOptions<
          SendTransactionData,
          SendTransactionErrorType,
          Compute<SendTransactionVariables<config, networkId>>,
          context
        >
      >
    | undefined
) => void;

export type SendTransactionMutateAsync<
  config extends Config,
  context = unknown
> = <networkId extends config["chains"][number]["id"]>(
  variables: SendTransactionVariables<config, networkId>,
  options?:
    | Compute<
        MutateOptions<
          SendTransactionData,
          SendTransactionErrorType,
          Compute<SendTransactionVariables<config, networkId>>,
          context
        >
      >
    | undefined
) => Promise<SendTransactionData>;
