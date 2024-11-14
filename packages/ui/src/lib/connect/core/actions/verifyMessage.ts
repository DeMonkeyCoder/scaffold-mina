import {
  type VerifyMessageErrorType as viem_VerifyMessageErrorType,
  type VerifyMessageParameters as viem_VerifyMessageParameters,
  type VerifyMessageReturnType as viem_VerifyMessageReturnType,
  verifyMessage as viem_verifyMessage,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { ChainIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type VerifyMessageParameters<config extends Config = Config> = Compute<
  viem_VerifyMessageParameters & ChainIdParameter<config>
>;

export type VerifyMessageReturnType = viem_VerifyMessageReturnType;

export type VerifyMessageErrorType = viem_VerifyMessageErrorType;

/** https://wagmi.sh/core/api/actions/verifyMessage */
export async function verifyMessage<config extends Config>(
  config: config,
  parameters: VerifyMessageParameters<config>
): Promise<VerifyMessageReturnType> {
  const { chainId, ...rest } = parameters;
  const client = config.getClient({ chainId });
  const action = getAction(client, viem_verifyMessage, "verifyMessage");
  return action(rest);
}
