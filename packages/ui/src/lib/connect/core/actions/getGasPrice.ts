import {
  type GetGasPriceErrorType as viem_GetGasPriceErrorType,
  type GetGasPriceReturnType as viem_GetGasPriceReturnType,
  getGasPrice as viem_getGasPrice,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetGasPriceParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<NetworkIdParameter<config, networkId>>;

export type GetGasPriceReturnType = viem_GetGasPriceReturnType;

export type GetGasPriceErrorType = viem_GetGasPriceErrorType;

/** https://wagmi.sh/core/api/actions/getGasPrice */
export function getGasPrice<
  config extends Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  config: config,
  parameters: GetGasPriceParameters<config, networkId> = {}
): Promise<GetGasPriceReturnType> {
  const { networkId } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_getGasPrice, "getGasPrice");
  return action({});
}
