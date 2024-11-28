import type { Abi } from "@/lib/connect/viem";
import type {
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";
import {
  type ReadContractErrorType as viem_ReadContractErrorType,
  type ReadContractParameters as viem_ReadContractParameters,
  type ReadContractReturnType as viem_ReadContractReturnType,
  readContract as viem_readContract,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import { getAction } from "../utils/getAction";

export type ReadContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "pure" | "view"
  > = ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<
    abi,
    "pure" | "view",
    functionName
  > = ContractFunctionArgs<abi, "pure" | "view", functionName>,
  config extends Config = Config
> = viem_ReadContractParameters<abi, functionName, args> &
  NetworkIdParameter<config>;

export type ReadContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "pure" | "view"
  > = ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<
    abi,
    "pure" | "view",
    functionName
  > = ContractFunctionArgs<abi, "pure" | "view", functionName>
> = viem_ReadContractReturnType<abi, functionName, args>;

export type ReadContractErrorType = viem_ReadContractErrorType;

/** https://wagmi.sh/core/api/actions/readContract */
export function readContract<
  config extends Config,
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<abi, "pure" | "view", functionName>
>(
  config: config,
  parameters: ReadContractParameters<abi, functionName, args, config>
): Promise<ReadContractReturnType<abi, functionName, args>> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_readContract, "readContract");
  return action(rest as any);
}
