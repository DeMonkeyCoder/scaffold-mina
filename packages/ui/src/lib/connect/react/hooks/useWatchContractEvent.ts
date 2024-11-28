"use client";

import {
  type Config,
  type ResolvedRegister,
  type WatchContractEventParameters,
  watchContractEvent,
} from "@/lib/connect/core/exports";
import type {
  UnionCompute,
  UnionExactPartial,
} from "@/lib/connect/core/exports/internal";
import { useEffect } from "react";

import type { Abi, ContractEventName } from "@/lib/connect/viem";
import type { ConfigParameter, EnabledParameter } from "../types/properties";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";

export type UseWatchContractEventParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> = ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = UnionCompute<
  UnionExactPartial<
    WatchContractEventParameters<abi, eventName, strict, config, networkId>
  > &
    ConfigParameter<config> &
    EnabledParameter
>;

export type UseWatchContractEventReturnType = void;

/** https://wagmi.sh/react/api/hooks/useWatchContractEvent */
export function useWatchContractEvent<
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  parameters: UseWatchContractEventParameters<
    abi,
    eventName,
    strict,
    config,
    networkId
  > = {} as any
): UseWatchContractEventReturnType {
  const { enabled = true, onLogs, config: _, ...rest } = parameters;

  const config = useConfig(parameters);
  const configNetworkId = useNetworkId({ config });
  const networkId = parameters.networkId ?? configNetworkId;

  // TODO(react@19): cleanup
  // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
  useEffect(() => {
    if (!enabled) return;
    if (!onLogs) return;
    return watchContractEvent(config, {
      ...(rest as any),
      networkId,
      onLogs,
    });
  }, [
    networkId,
    config,
    enabled,
    onLogs,
    ///
    rest.abi,
    rest.address,
    rest.args,
    rest.batch,
    rest.eventName,
    rest.fromBlock,
    rest.onError,
    rest.poll,
    rest.pollingInterval,
    rest.strict,
    rest.syncConnectedChain,
  ]);
}
