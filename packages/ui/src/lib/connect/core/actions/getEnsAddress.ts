import {
  type GetEnsAddressErrorType as viem_GetEnsAddressErrorType,
  type GetEnsAddressParameters as viem_GetEnsAddressParameters,
  type GetEnsAddressReturnType as viem_GetEnsAddressReturnType,
  getEnsAddress as viem_getEnsAddress,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { ChainIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetEnsAddressParameters<config extends Config = Config> = Compute<
  viem_GetEnsAddressParameters & ChainIdParameter<config>
>;

export type GetEnsAddressReturnType = viem_GetEnsAddressReturnType;

export type GetEnsAddressErrorType = viem_GetEnsAddressErrorType;

/** https://wagmi.sh/core/api/actions/getEnsAddress */
export function getEnsAddress<config extends Config>(
  config: config,
  parameters: GetEnsAddressParameters<config>
): Promise<GetEnsAddressReturnType> {
  const { chainId, ...rest } = parameters;
  const client = config.getClient({ chainId });
  const action = getAction(client, viem_getEnsAddress, "getEnsAddress");
  return action(rest);
}
