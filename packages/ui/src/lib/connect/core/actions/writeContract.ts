import type {
  Abi,
  Account,
  Chain,
  Client,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";
import {
  type WriteContractErrorType as viem_WriteContractErrorType,
  type WriteContractParameters as viem_WriteContractParameters,
  type WriteContractReturnType as viem_WriteContractReturnType,
  writeContract as viem_writeContract,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { BaseErrorType, ErrorType } from "../errors/base";
import type { SelectChains } from "../types/chain";
import type {
  NetworkIdParameter,
  ConnectorParameter,
} from "../types/properties";
import type { Compute, UnionCompute } from "../types/utils";
import { getAction } from "../utils/getAction";
import { getAccount } from "./getAccount";
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from "./getConnectorClient";
import {
  type SimulateContractErrorType,
  simulateContract,
} from "./simulateContract";

export type WriteContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "nonpayable" | "payable"
  > = ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  > = ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  allFunctionNames = ContractFunctionName<abi, "nonpayable" | "payable">,
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = UnionCompute<
  {
    // TODO: Should use `UnionStrictOmit<..., 'chain'>` on `viem_WriteContractParameters` result instead
    // temp workaround that doesn't affect runtime behavior for for https://github.com/wevm/wagmi/issues/3981
    [key in keyof chains]: viem_WriteContractParameters<
      abi,
      functionName,
      args,
      chains[key],
      Account,
      chains[key],
      allFunctionNames
    >;
  }[number] &
    Compute<NetworkIdParameter<config, networkId>> &
    ConnectorParameter & { __mode?: "prepared" }
>;

export type WriteContractReturnType = viem_WriteContractReturnType;

export type WriteContractErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // simulateContract()
  | SimulateContractErrorType
  // base
  | BaseErrorType
  | ErrorType
  // @/lib/connect/viem
  | viem_WriteContractErrorType;

/** https://wagmi.sh/core/api/actions/writeContract */
export async function writeContract<
  config extends Config,
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  >,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: WriteContractParameters<
    abi,
    functionName,
    args,
    config,
    networkId
  >
): Promise<WriteContractReturnType> {
  const { account, networkId, connector, __mode, ...rest } = parameters;

  let client: Client;
  if (typeof account === "object" && account.type === "local")
    client = config.getClient({ networkId });
  else
    client = await getConnectorClient(config, {
      account,
      networkId,
      connector,
    });

  const { connector: activeConnector } = getAccount(config);

  let request: any;
  if (__mode === "prepared" || activeConnector?.supportsSimulation)
    request = rest;
  else {
    const { request: simulateRequest } = await simulateContract(config, {
      ...rest,
      account,
      networkId,
    } as any);
    request = simulateRequest;
  }

  const action = getAction(client, viem_writeContract, "writeContract");
  const hash = await action({
    ...request,
    ...(account ? { account } : {}),
    chain: networkId ? { id: networkId } : null,
  });

  return hash;
}
