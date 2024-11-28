import {
  type WatchBlockNumberParameters as viem_WatchBlockNumberParameters,
  type WatchBlockNumberReturnType as viem_WatchBlockNumberReturnType,
  watchBlockNumber as viem_watchBlockNumber,
} from "@/lib/connect/viem/actions";

import type { Chain, Transport, WebSocketTransport } from "@/lib/connect/viem";
import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type {
  NetworkIdParameter,
  SyncConnectedChainParameter,
} from "../types/properties";
import type { UnionCompute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type WatchBlockNumberParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: UnionCompute<
    viem_WatchBlockNumberParameters<
      config["_internal"]["transports"][chains[key]["id"]] extends infer transport extends Transport
        ? Transport extends transport
          ? WebSocketTransport
          : transport
        : WebSocketTransport
    > &
      NetworkIdParameter<config, networkId> &
      SyncConnectedChainParameter
  >;
}[number];

export type WatchBlockNumberReturnType = viem_WatchBlockNumberReturnType;

// TODO: wrap in @/lib/connect/viem's `observe` to avoid duplicate invocations.
/** https://wagmi.sh/core/api/actions/watchBlockNumber */
export function watchBlockNumber<
  config extends Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  config: config,
  parameters: WatchBlockNumberParameters<config, networkId>
): WatchBlockNumberReturnType {
  const { syncConnectedChain = config._internal.syncConnectedChain, ...rest } =
    parameters as WatchBlockNumberParameters;

  let unwatch: WatchBlockNumberReturnType | undefined;
  const listener = (networkId: string | undefined) => {
    if (unwatch) unwatch();

    const client = config.getClient({ networkId });
    const action = getAction(client, viem_watchBlockNumber, "watchBlockNumber");
    unwatch = action(rest as viem_WatchBlockNumberParameters);
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
