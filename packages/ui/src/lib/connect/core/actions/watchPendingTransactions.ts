import type { Chain, Transport, WebSocketTransport } from "@/lib/connect/viem";
import {
  type WatchPendingTransactionsParameters as viem_WatchPendingTransactionsParameters,
  type WatchPendingTransactionsReturnType as viem_WatchPendingTransactionsReturnType,
  watchPendingTransactions as viem_watchPendingTransactions,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type {
  ChainIdParameter,
  SyncConnectedChainParameter,
} from "../types/properties";
import type { UnionCompute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type WatchPendingTransactionsParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, chainId>
> = {
  [key in keyof chains]: UnionCompute<
    viem_WatchPendingTransactionsParameters<
      config["_internal"]["transports"][chains[key]["id"]] extends infer transport extends Transport
        ? Transport extends transport
          ? WebSocketTransport
          : transport
        : WebSocketTransport
    > &
      ChainIdParameter<config, chainId> &
      SyncConnectedChainParameter
  >;
}[number];

export type WatchPendingTransactionsReturnType =
  viem_WatchPendingTransactionsReturnType;

// TODO: wrap in @/lib/connect/viem's `observe` to avoid duplicate invocations.
/** https://wagmi.sh/core/api/actions/watchPendingTransactions */
export function watchPendingTransactions<
  config extends Config,
  chainId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: WatchPendingTransactionsParameters<config, chainId>
) {
  const { syncConnectedChain = config._internal.syncConnectedChain, ...rest } =
    parameters;

  let unwatch: WatchPendingTransactionsReturnType | undefined;
  const listener = (chainId: number | undefined) => {
    if (unwatch) unwatch();

    const client = config.getClient({ chainId });
    const action = getAction(
      client,
      viem_watchPendingTransactions,
      "watchPendingTransactions"
    );
    unwatch = action(rest as viem_WatchPendingTransactionsParameters);
    return unwatch;
  };

  // set up listener for transaction changes
  const unlisten = listener(parameters.chainId);

  // set up subscriber for connected chain changes
  let unsubscribe: (() => void) | undefined;
  if (syncConnectedChain && !parameters.chainId)
    unsubscribe = config.subscribe(
      ({ chainId }) => chainId,
      async (chainId) => listener(chainId)
    );

  return () => {
    unlisten?.();
    unsubscribe?.();
  };
}
