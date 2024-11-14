import {
  type GetStorageAtErrorType as viem_GetStorageAtErrorType,
  type GetStorageAtParameters as viem_GetStorageAtParameters,
  type GetStorageAtReturnType as viem_GetStorageAtReturnType,
  getStorageAt as viem_getStorageAt,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { ChainIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetStorageAtParameters<config extends Config = Config> = Compute<
  viem_GetStorageAtParameters & ChainIdParameter<config>
>;

export type GetStorageAtReturnType = viem_GetStorageAtReturnType;

export type GetStorageAtErrorType = viem_GetStorageAtErrorType;

/** https://wagmi.sh/core/api/actions/getStorageAt */
export async function getStorageAt<config extends Config>(
  config: config,
  parameters: GetStorageAtParameters<config>
): Promise<GetStorageAtReturnType> {
  const { chainId, ...rest } = parameters;
  const client = config.getClient({ chainId });
  const action = getAction(client, viem_getStorageAt, "getStorageAt");
  return action(rest);
}
