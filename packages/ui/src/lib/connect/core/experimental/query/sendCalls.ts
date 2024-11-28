import type { MutateOptions, MutationOptions } from "@tanstack/query-core";

import type { Config } from "../../createConfig";
import type { Compute } from "../../types/utils";
import {
  type SendCallsErrorType,
  type SendCallsParameters,
  type SendCallsReturnType,
  sendCalls,
} from "../actions/sendCalls";

export function sendCallsMutationOptions<config extends Config>(
  config: config
) {
  return {
    mutationFn(variables) {
      return sendCalls(config, variables);
    },
    mutationKey: ["sendCalls"],
  } as const satisfies MutationOptions<
    SendCallsData,
    SendCallsErrorType,
    SendCallsVariables<config, config["chains"][number]["id"]>
  >;
}

export type SendCallsData = Compute<SendCallsReturnType>;

export type SendCallsVariables<
  config extends Config,
  networkId extends config["chains"][number]["id"]
> = SendCallsParameters<config, networkId>;

export type SendCallsMutate<config extends Config, context = unknown> = <
  networkId extends config["chains"][number]["id"]
>(
  variables: SendCallsVariables<config, networkId>,
  options?:
    | Compute<
        MutateOptions<
          SendCallsData,
          SendCallsErrorType,
          Compute<SendCallsVariables<config, networkId>>,
          context
        >
      >
    | undefined
) => void;

export type SendCallsMutateAsync<config extends Config, context = unknown> = <
  networkId extends config["chains"][number]["id"]
>(
  variables: SendCallsVariables<config, networkId>,
  options?:
    | Compute<
        MutateOptions<
          SendCallsData,
          SendCallsErrorType,
          Compute<SendCallsVariables<config, networkId>>,
          context
        >
      >
    | undefined
) => Promise<SendCallsData>;
