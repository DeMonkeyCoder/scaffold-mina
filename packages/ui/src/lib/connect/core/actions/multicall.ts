import type {
  ContractFunctionParameters,
  MulticallErrorType as viem_MulticallErrorType,
  MulticallParameters as viem_MulticallParameters,
  MulticallReturnType as viem_MulticallReturnType,
} from "@/lib/connect/viem";
import { multicall as viem_multicall } from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import { getAction } from "../utils/getAction";

export type MulticallParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config
> = viem_MulticallParameters<contracts, allowFailure> &
  NetworkIdParameter<config>;

export type MulticallReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true
> = viem_MulticallReturnType<contracts, allowFailure>;

export type MulticallErrorType = viem_MulticallErrorType;

export async function multicall<
  config extends Config,
  const contracts extends readonly ContractFunctionParameters[],
  allowFailure extends boolean = true
>(
  config: config,
  parameters: MulticallParameters<contracts, allowFailure, config>
): Promise<MulticallReturnType<contracts, allowFailure>> {
  const { allowFailure = true, networkId, contracts, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_multicall, "multicall");
  return action({
    allowFailure,
    contracts,
    ...rest,
  }) as Promise<MulticallReturnType<contracts, allowFailure>>;
}
