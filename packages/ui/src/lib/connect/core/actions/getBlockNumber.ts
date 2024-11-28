import {
  type GetBlockNumberErrorType as viem_GetBlockNumberErrorType,
  type GetBlockNumberParameters as viem_GetBlockNumberParameters,
  type GetBlockNumberReturnType as viem_GetBlockNumberReturnType,
  getBlockNumber as viem_getBlockNumber,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetBlockNumberParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  viem_GetBlockNumberParameters & NetworkIdParameter<config, networkId>
>;

export type GetBlockNumberReturnType = viem_GetBlockNumberReturnType;

export type GetBlockNumberErrorType = viem_GetBlockNumberErrorType;

/** https://wagmi.sh/core/api/actions/getBlockNumber */
export function getBlockNumber<
  config extends Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  config: config,
  parameters: GetBlockNumberParameters<config, networkId> = {}
): Promise<GetBlockNumberReturnType> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_getBlockNumber, "getBlockNumber");
  return action(rest);
}
