import {
  type GetBytecodeErrorType as viem_GetBytecodeErrorType,
  type GetBytecodeParameters as viem_GetBytecodeParameters,
  type GetBytecodeReturnType as viem_GetBytecodeReturnType,
  getBytecode as viem_getBytecode,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetBytecodeParameters<config extends Config = Config> = Compute<
  viem_GetBytecodeParameters & NetworkIdParameter<config>
>;

export type GetBytecodeReturnType = viem_GetBytecodeReturnType;

export type GetBytecodeErrorType = viem_GetBytecodeErrorType;

/** https://wagmi.sh/core/api/actions/getBytecode */
export async function getBytecode<config extends Config>(
  config: config,
  parameters: GetBytecodeParameters<config>
): Promise<GetBytecodeReturnType> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_getBytecode, "getBytecode");
  return action(rest);
}
