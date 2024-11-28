import type {
  CallErrorType as viem_CallErrorType,
  CallParameters as viem_CallParameters,
  CallReturnType as viem_CallReturnType,
} from "@/lib/connect/viem";
import { call as viem_call } from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import { getAction } from "../utils/getAction";

export type CallParameters<config extends Config = Config> =
  viem_CallParameters & NetworkIdParameter<config>;

export type CallReturnType = viem_CallReturnType;

export type CallErrorType = viem_CallErrorType;

export async function call<config extends Config>(
  config: config,
  parameters: CallParameters<config>
): Promise<CallReturnType> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_call, "call");
  return action(rest);
}
