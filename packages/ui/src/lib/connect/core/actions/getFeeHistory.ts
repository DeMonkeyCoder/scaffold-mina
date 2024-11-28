import {
  type GetFeeHistoryErrorType as viem_GetFeeHistoryErrorType,
  type GetFeeHistoryParameters as viem_GetFeeHistoryParameters,
  type GetFeeHistoryReturnType as viem_GetFeeHistoryReturnType,
  getFeeHistory as viem_getFeeHistory,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetFeeHistoryParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  viem_GetFeeHistoryParameters & NetworkIdParameter<config, networkId>
>;

export type GetFeeHistoryReturnType = viem_GetFeeHistoryReturnType;

export type GetFeeHistoryErrorType = viem_GetFeeHistoryErrorType;

/** https://wagmi.sh/core/api/actions/getFeeHistory */
export function getFeeHistory<
  config extends Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  config: config,
  parameters: GetFeeHistoryParameters<config, networkId>
): Promise<GetFeeHistoryReturnType> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_getFeeHistory, "getFeeHistory");
  return action(rest);
}
