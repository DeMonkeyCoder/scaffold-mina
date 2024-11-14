import type {
  CallErrorType as viem_CallErrorType,
  CallParameters as viem_CallParameters,
  CallReturnType as viem_CallReturnType,
} from "@/lib/connect/viem";
import { call as viem_call } from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { ChainIdParameter } from "../types/properties";
import { getAction } from "../utils/getAction";

export type CallParameters<config extends Config = Config> =
  viem_CallParameters & ChainIdParameter<config>;

export type CallReturnType = viem_CallReturnType;

export type CallErrorType = viem_CallErrorType;

export async function call<config extends Config>(
  config: config,
  parameters: CallParameters<config>
): Promise<CallReturnType> {
  const { chainId, ...rest } = parameters;
  const client = config.getClient({ chainId });
  const action = getAction(client, viem_call, "call");
  return action(rest);
}
