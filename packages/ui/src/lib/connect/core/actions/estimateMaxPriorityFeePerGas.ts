import type { Chain } from "@/lib/connect/viem";
import {
  type EstimateMaxPriorityFeePerGasErrorType as viem_EstimateMaxPriorityFeePerGasErrorType,
  type EstimateMaxPriorityFeePerGasParameters as viem_EstimateMaxPriorityFeePerGasParameters,
  type EstimateMaxPriorityFeePerGasReturnType as viem_EstimateMaxPriorityFeePerGasReturnType,
  estimateMaxPriorityFeePerGas as viem_estimateMaxPriorityFeePerGas,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute, UnionLooseOmit } from "../types/utils";
import { getAction } from "../utils/getAction";

export type EstimateMaxPriorityFeePerGasParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  UnionLooseOmit<
    viem_EstimateMaxPriorityFeePerGasParameters<Chain, Chain> &
      NetworkIdParameter<config, networkId>,
    "chain"
  >
>;

export type EstimateMaxPriorityFeePerGasReturnType =
  viem_EstimateMaxPriorityFeePerGasReturnType;

export type EstimateMaxPriorityFeePerGasErrorType =
  viem_EstimateMaxPriorityFeePerGasErrorType;

/** https://wagmi.sh/core/api/actions/estimateMaxPriorityFeePerGas */
export async function estimateMaxPriorityFeePerGas<
  config extends Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  config: config,
  parameters: EstimateMaxPriorityFeePerGasParameters<config, networkId> = {}
): Promise<EstimateMaxPriorityFeePerGasReturnType> {
  const { networkId } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(
    client,
    viem_estimateMaxPriorityFeePerGas,
    "estimateMaxPriorityFeePerGas"
  );
  return action({ chain: client.chain });
}
