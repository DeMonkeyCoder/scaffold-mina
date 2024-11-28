import {
  type WatchBlocksParameters as viem_WatchBlocksParameters,
  type WatchBlocksReturnType as viem_WatchBlocksReturnType,
  watchBlocks as viem_watchBlocks,
} from "@/lib/connect/viem/actions";

import type {
  BlockTag,
  Chain,
  Transport,
  WebSocketTransport,
} from "@/lib/connect/viem";
import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type {
  NetworkIdParameter,
  SyncConnectedChainParameter,
} from "../types/properties";
import type { IsNarrowable, UnionCompute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type WatchBlocksParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest",
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: UnionCompute<
    viem_WatchBlocksParameters<
      config["_internal"]["transports"][chains[key]["id"]] extends infer transport extends Transport
        ? Transport extends transport
          ? WebSocketTransport
          : transport
        : WebSocketTransport,
      IsNarrowable<chains[key], Chain> extends true ? chains[key] : undefined,
      includeTransactions,
      blockTag
    > &
      NetworkIdParameter<config, networkId> &
      SyncConnectedChainParameter
  >;
}[number];

export type WatchBlocksReturnType = viem_WatchBlocksReturnType;

// TODO: wrap in @/lib/connect/viem's `observe` to avoid duplicate invocations.
/** https://wagmi.sh/core/actions/watchBlocks */
export function watchBlocks<
  config extends Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest"
>(
  config: config,
  parameters: WatchBlocksParameters<
    includeTransactions,
    blockTag,
    config,
    networkId
  >
): WatchBlocksReturnType {
  const { syncConnectedChain = config._internal.syncConnectedChain, ...rest } =
    parameters as WatchBlocksParameters;

  let unwatch: WatchBlocksReturnType | undefined;
  const listener = (networkId: string | undefined) => {
    if (unwatch) unwatch();

    const client = config.getClient({ networkId });
    const action = getAction(client, viem_watchBlocks, "watchBlocks");
    unwatch = action(rest as viem_WatchBlocksParameters);
    return unwatch;
  };

  // set up listener for block number changes
  const unlisten = listener(parameters.networkId);

  // set up subscriber for connected chain changes
  let unsubscribe: (() => void) | undefined;
  if (syncConnectedChain && !parameters.networkId)
    unsubscribe = config.subscribe(
      ({ networkId }) => networkId,
      async (networkId) => listener(networkId)
    );

  return () => {
    unlisten?.();
    unsubscribe?.();
  };
}
