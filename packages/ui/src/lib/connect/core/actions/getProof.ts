import {
  type GetProofErrorType as viem_GetProofErrorType,
  type GetProofParameters as viem_GetProofParameters,
  type GetProofReturnType as viem_GetProofReturnType,
  getProof as viem_getProof,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetProofParameters<config extends Config = Config> = Compute<
  viem_GetProofParameters & NetworkIdParameter<config>
>;

export type GetProofReturnType = viem_GetProofReturnType;

export type GetProofErrorType = viem_GetProofErrorType;

/** https://wagmi.sh/core/api/actions/getProof */
export async function getProof<config extends Config>(
  config: config,
  parameters: GetProofParameters<config>
): Promise<GetProofReturnType> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_getProof, "getProof");
  return action(rest);
}
