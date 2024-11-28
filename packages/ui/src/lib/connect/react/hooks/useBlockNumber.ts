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
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";
import {
  type UseWatchBlockNumberParameters,
  useWatchBlockNumber,
} from "./useWatchBlockNumber";

export type UseBlockNumberParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockNumberData
> = Compute<
  GetBlockNumberOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetBlockNumberQueryFnData,
      GetBlockNumberErrorType,
      selectData,
      GetBlockNumberQueryKey<config, networkId>
    > & {
      watch?:
        | boolean
        | UnionCompute<
            UnionStrictOmit<
              UseWatchBlockNumberParameters<config, networkId>,
              "networkId" | "config" | "onBlockNumber" | "onError"
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
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockNumberData
>(
  parameters: UseBlockNumberParameters<config, networkId, selectData> = {}
): UseBlockNumberReturnType<selectData> {
  const { query = {}, watch } = parameters;

  const config = useConfig(parameters);
  const queryClient = useQueryClient();
  const configNetworkId = useNetworkId({ config });
  const networkId = parameters.networkId ?? configNetworkId;

  const options = getBlockNumberQueryOptions(config, {
    ...parameters,
    networkId,
  });

  useWatchBlockNumber({
    ...({
      config: parameters.config,
      networkId: parameters.networkId,
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
