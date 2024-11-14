"use client";

import {
  type Config,
  type ResolvedRegister,
  type WatchPendingTransactionsParameters,
  watchPendingTransactions,
} from "@/lib/connect/core/exports";
import type {
  UnionCompute,
  UnionExactPartial,
} from "@/lib/connect/core/exports/internal";
import { useEffect } from "react";

import type { ConfigParameter, EnabledParameter } from "../types/properties";
import { useChainId } from "./useChainId";
import { useConfig } from "./useConfig";

export type UseWatchPendingTransactionsParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = UnionCompute<
  UnionExactPartial<WatchPendingTransactionsParameters<config, chainId>> &
    ConfigParameter<config> &
    EnabledParameter
>;

export type UseWatchPendingTransactionsReturnType = void;

/** https://wagmi.sh/react/api/hooks/useWatchPendingTransactions */
export function useWatchPendingTransactions<
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  parameters: UseWatchPendingTransactionsParameters<config, chainId> = {} as any
): UseWatchPendingTransactionsReturnType {
  const { enabled = true, onTransactions, config: _, ...rest } = parameters;

  const config = useConfig(parameters);
  const configChainId = useChainId({ config });
  const chainId = parameters.chainId ?? configChainId;

  // TODO(react@19): cleanup
  // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
  useEffect(() => {
    if (!enabled) return;
    if (!onTransactions) return;
    return watchPendingTransactions(config, {
      ...(rest as any),
      chainId,
      onTransactions,
    });
  }, [
    chainId,
    config,
    enabled,
    onTransactions,
    ///
    rest.batch,
    rest.onError,
    rest.poll,
    rest.pollingInterval,
    rest.syncConnectedChain,
  ]);
}
