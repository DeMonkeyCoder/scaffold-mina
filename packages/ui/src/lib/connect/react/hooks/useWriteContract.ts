"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  Config,
  ResolvedRegister,
  WriteContractErrorType,
} from "@/lib/connect/core/exports";
import {
  type WriteContractData,
  type WriteContractMutate,
  type WriteContractMutateAsync,
  type WriteContractVariables,
  writeContractMutationOptions,
} from "@/lib/connect/core/exports/query";
import type { Abi } from "@/lib/connect/viem";

import type { ConfigParameter } from "../types/properties";
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from "../utils/query";
import { useConfig } from "./useConfig";

export type UseWriteContractParameters<
  config extends Config = Config,
  context = unknown
> = ConfigParameter<config> & {
  mutation?:
    | UseMutationParameters<
        WriteContractData,
        WriteContractErrorType,
        WriteContractVariables<
          Abi,
          string,
          readonly unknown[],
          config,
          config["chains"][number]["id"]
        >,
        context
      >
    | undefined;
};

export type UseWriteContractReturnType<
  config extends Config = Config,
  context = unknown
> = UseMutationReturnType<
  WriteContractData,
  WriteContractErrorType,
  WriteContractVariables<
    Abi,
    string,
    readonly unknown[],
    config,
    config["chains"][number]["id"]
  >,
  context
> & {
  writeContract: WriteContractMutate<config, context>;
  writeContractAsync: WriteContractMutateAsync<config, context>;
};

/** https://wagmi.sh/react/api/hooks/useWriteContract */
export function useWriteContract<
  config extends Config = ResolvedRegister["config"],
  context = unknown
>(
  parameters: UseWriteContractParameters<config, context> = {}
): UseWriteContractReturnType<config, context> {
  const { mutation } = parameters;

  const config = useConfig(parameters);

  const mutationOptions = writeContractMutationOptions(config);
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  });

  type Return = UseWriteContractReturnType<config, context>;
  return {
    ...result,
    writeContract: mutate as Return["writeContract"],
    writeContractAsync: mutateAsync as Return["writeContractAsync"],
  };
}
