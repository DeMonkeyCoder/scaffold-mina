import type {
  Abi,
  Chain,
  ContractEventName,
  Transport,
  WebSocketTransport,
} from "@/lib/connect/viem";
import {
  type WatchContractEventParameters as viem_WatchContractEventParameters,
  type WatchContractEventReturnType as viem_WatchContractEventReturnType,
  watchContractEvent as viem_watchContractEvent,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type {
  NetworkIdParameter,
  SyncConnectedChainParameter,
} from "../types/properties";
import type { UnionCompute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type WatchContractEventParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> | undefined = ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: UnionCompute<
    viem_WatchContractEventParameters<
      abi,
      eventName,
      strict,
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

export type WatchContractEventReturnType = viem_WatchContractEventReturnType;

// TODO: wrap in @/lib/connect/viem's `observe` to avoid duplicate invocations.
/** https://wagmi.sh/core/api/actions/watchContractEvent */
export function watchContractEvent<
  config extends Config,
  networkId extends config["chains"][number]["id"],
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi> | undefined,
  strict extends boolean | undefined = undefined
>(
  config: config,
  parameters: WatchContractEventParameters<
    abi,
    eventName,
    strict,
    config,
    networkId
  >
) {
  const { syncConnectedChain = config._internal.syncConnectedChain, ...rest } =
    parameters;

  let unwatch: WatchContractEventReturnType | undefined;
  const listener = (networkId: string | undefined) => {
    if (unwatch) unwatch();

    const client = config.getClient({ networkId });
    const action = getAction(
      client,
      viem_watchContractEvent,
      "watchContractEvent"
    );
    unwatch = action(rest as unknown as viem_WatchContractEventParameters);
    return unwatch;
  };

  // set up listener for transaction changes
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
