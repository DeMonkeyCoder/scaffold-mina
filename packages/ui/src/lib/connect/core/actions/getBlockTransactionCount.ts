import {
  type GetBlockTransactionCountErrorType as viem_GetBlockTransactionCountErrorType,
  type GetBlockTransactionCountParameters as viem_GetBlockTransactionCountParameters,
  type GetBlockTransactionCountReturnType as viem_GetBlockTransactionCountReturnType,
  getBlockTransactionCount as viem_getBlockTransactionCount,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import type { UnionCompute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetBlockTransactionCountParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = UnionCompute<
  viem_GetBlockTransactionCountParameters &
    NetworkIdParameter<config, networkId>
>;

export type GetBlockTransactionCountReturnType =
  viem_GetBlockTransactionCountReturnType;

export type GetBlockTransactionCountErrorType =
  viem_GetBlockTransactionCountErrorType;

/** https://wagmi.sh/core/api/actions/getBlockTransactionCount */
export function getBlockTransactionCount<
  config extends Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  config: config,
  parameters: GetBlockTransactionCountParameters<config, networkId> = {}
): Promise<GetBlockTransactionCountReturnType> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(
    client,
    viem_getBlockTransactionCount,
    "getBlockTransactionCount"
  );
  return action(rest);
}
