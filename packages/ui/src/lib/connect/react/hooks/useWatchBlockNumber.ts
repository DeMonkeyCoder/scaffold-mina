"use client";

import {
  type Config,
  type ResolvedRegister,
  type WatchBlockNumberParameters,
  watchBlockNumber,
} from "@/lib/connect/core/exports";
import type {
  UnionCompute,
  UnionExactPartial,
} from "@/lib/connect/core/exports/internal";
import { useEffect } from "react";

import type { ConfigParameter, EnabledParameter } from "../types/properties";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseWatchBlockNumberParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = UnionCompute<
  UnionExactPartial<WatchBlockNumberParameters<config, networkId>> &
    ConfigParameter<config> &
    EnabledParameter
>;

export type UseWatchBlockNumberReturnType = void;

/** https://wagmi.sh/react/api/hooks/useWatchBlockNumber */
export function useWatchBlockNumber<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  parameters: UseWatchBlockNumberParameters<config, networkId> = {} as any
): UseWatchBlockNumberReturnType {
  const { enabled = true, onBlockNumber, config: _, ...rest } = parameters;

  const config = useConfig(parameters);
  const configNetworkId = useNetworkId({ config });
  const networkId = parameters.networkId ?? configNetworkId;

  // TODO(react@19): cleanup
  // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
  useEffect(() => {
    if (!enabled) return;
    if (!onBlockNumber) return;
    return watchBlockNumber(config, {
      ...(rest as any),
      networkId,
      onBlockNumber,
    });
  }, [
    networkId,
    config,
    enabled,
    onBlockNumber,
    ///
    rest.onError,
    rest.emitMissed,
    rest.emitOnBegin,
    rest.poll,
    rest.pollingInterval,
    rest.syncConnectedChain,
  ]);
}
