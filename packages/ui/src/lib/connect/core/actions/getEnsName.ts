import {
  type GetEnsNameErrorType as viem_GetEnsNameErrorType,
  type GetEnsNameParameters as viem_GetEnsNameParameters,
  type GetEnsNameReturnType as viem_GetEnsNameReturnType,
  getEnsName as viem_getEnsName,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { ChainIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetEnsNameParameters<config extends Config = Config> = Compute<
  viem_GetEnsNameParameters & ChainIdParameter<config>
>;

export type GetEnsNameReturnType = viem_GetEnsNameReturnType;

export type GetEnsNameErrorType = viem_GetEnsNameErrorType;

/** https://wagmi.sh/core/api/actions/getEnsName */
export function getEnsName<config extends Config>(
  config: config,
  parameters: GetEnsNameParameters<config>
): Promise<GetEnsNameReturnType> {
  const { chainId, ...rest } = parameters;
  const client = config.getClient({ chainId });
  const action = getAction(client, viem_getEnsName, "getEnsName");
  return action(rest);
}
