"use client";

import { useQueryClient } from "@tanstack/react-query";
import type {
  Config,
  GetBlockErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type {
  Compute,
  UnionCompute,
  UnionStrictOmit,
} from "@/lib/connect/core/exports/internal";
import {
  type GetBlockData,
  type GetBlockOptions,
  type GetBlockQueryFnData,
  type GetBlockQueryKey,
  getBlockQueryOptions,
} from "@/lib/connect/core/exports/query";
import type { BlockTag } from "@/lib/connect/viem";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";
import {
  type UseWatchBlocksParameters,
  useWatchBlocks,
} from "./useWatchBlocks";

export type UseBlockParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest",
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockData<includeTransactions, blockTag, config, networkId>
> = Compute<
  GetBlockOptions<includeTransactions, blockTag, config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetBlockQueryFnData<includeTransactions, blockTag, config, networkId>,
      GetBlockErrorType,
      selectData,
      GetBlockQueryKey<includeTransactions, blockTag, config, networkId>
    > & {
      watch?:
        | boolean
        | UnionCompute<
            UnionStrictOmit<
              UseWatchBlocksParameters<
                includeTransactions,
                blockTag,
                config,
                networkId
              >,
              "networkId" | "config" | "onBlock" | "onError"
            >
          >
        | undefined;
    }
>;

export type UseBlockReturnType<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest",
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockData<includeTransactions, blockTag, config, networkId>
> = UseQueryReturnType<selectData, GetBlockErrorType>;

/** https://wagmi.sh/react/hooks/useBlock */
export function useBlock<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest",
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetBlockData<includeTransactions, blockTag, config, networkId>
>(
  parameters: UseBlockParameters<
    includeTransactions,
    blockTag,
    config,
    networkId,
    selectData
  > = {}
): UseBlockReturnType<
  includeTransactions,
  blockTag,
  config,
  networkId,
  selectData
> {
  const { query = {}, watch } = parameters;

  const config = useConfig(parameters);
  const queryClient = useQueryClient();
  const configNetworkId = useNetworkId({ config });
  const networkId = parameters.networkId ?? configNetworkId;

  const options = getBlockQueryOptions(config, {
    ...parameters,
    networkId,
  });
  const enabled = Boolean(query.enabled ?? true);

  useWatchBlocks({
    ...({
      config: parameters.config,
      networkId: parameters.networkId!,
      ...(typeof watch === "object" ? watch : {}),
    } as UseWatchBlocksParameters),
    enabled: Boolean(
      enabled && (typeof watch === "object" ? watch.enabled : watch)
    ),
    onBlock(block) {
      queryClient.setQueryData(options.queryKey, block);
    },
  });

  return useQuery({
    ...(query as any),
    ...options,
    enabled,
  }) as UseBlockReturnType<
    includeTransactions,
    blockTag,
    config,
    networkId,
    selectData
  >;
}
