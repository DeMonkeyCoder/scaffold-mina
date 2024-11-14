"use client";

import { useQueryClient } from "@tanstack/react-query";
import type {
  Config,
  GetBlockNumberErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type {
  Compute,
  UnionCompute,
  UnionStrictOmit,
} from "@/lib/connect/core/exports/internal";
import {
  type GetBlockNumberData,
  type GetBlockNumberOptions,
  type GetBlockNumberQueryFnData,
  type GetBlockNumberQueryKey,
  getBlockNumberQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";
import {
  type UseWatchBlockNumberParameters,
  useWatchBlockNumber,
} from "./useWatchBlockNumber";

export type UseBlockNumberParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockNumberData
> = Compute<
  GetBlockNumberOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      GetBlockNumberQueryFnData,
      GetBlockNumberErrorType,
      selectData,
      GetBlockNumberQueryKey<config, chainId>
    > & {
      watch?:
        | boolean
        | UnionCompute<
            UnionStrictOmit<
              UseWatchBlockNumberParameters<config, chainId>,
              "chainId" | "config" | "onBlockNumber" | "onError"
            >
          >
        | undefined;
    }
>;

export type UseBlockNumberReturnType<selectData = GetBlockNumberData> =
  UseQueryReturnType<selectData, GetBlockNumberErrorType>;

/** https://wagmi.sh/react/api/hooks/useBlockNumber */
export function useBlockNumber<
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockNumberData
>(
  parameters: UseBlockNumberParameters<config, chainId, selectData> = {}
): UseBlockNumberReturnType<selectData> {
  const { query = {}, watch } = parameters;

  const config = useConfig(parameters);
  const queryClient = useQueryClient();
  const configChainId = useChainId({ config });
  const chainId = parameters.chainId ?? configChainId;

  const options = getBlockNumberQueryOptions(config, {
    ...parameters,
    chainId,
  });

  useWatchBlockNumber({
    ...({
      config: parameters.config,
      chainId: parameters.chainId,
      ...(typeof watch === "object" ? watch : {}),
    } as UseWatchBlockNumberParameters),
    enabled: Boolean(
      (query.enabled ?? true) &&
        (typeof watch === "object" ? watch.enabled : watch)
    ),
    onBlockNumber(blockNumber) {
      queryClient.setQueryData(options.queryKey, blockNumber);
    },
  });

  return useQuery({ ...query, ...options });
}
