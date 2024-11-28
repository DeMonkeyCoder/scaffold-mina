import type {
  Abi,
  Account,
  Address,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";
import {
  type SimulateContractErrorType as viem_SimulateContractErrorType,
  type SimulateContractParameters as viem_SimulateContractParameters,
  type SimulateContractReturnType as viem_SimulateContractReturnType,
  simulateContract as viem_simulateContract,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { BaseErrorType, ErrorType } from "../errors/base";
import type { SelectChains } from "../types/chain";
import type {
  NetworkIdParameter,
  ConnectorParameter,
} from "../types/properties";
import type {
  Compute,
  PartialBy,
  UnionCompute,
  UnionStrictOmit,
} from "../types/utils";
import { getAction } from "../utils/getAction";
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from "./getConnectorClient";

export type SimulateContractParameters<
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
  networkId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: UnionCompute<
    UnionStrictOmit<
      viem_SimulateContractParameters<
        abi,
        functionName,
        args,
        chains[key],
        chains[key],
        Account | Address
      >,
      "chain"
    >
  > &
    NetworkIdParameter<config, networkId> &
    ConnectorParameter;
}[number];

export type SimulateContractReturnType<
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
  networkId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: viem_SimulateContractReturnType<
    abi,
    functionName,
    args,
    chains[key],
    Account,
    chains[key]
  > & {
    networkId: chains[key]["id"];
    request: Compute<
      PartialBy<
        { __mode: "prepared"; networkId: networkId; chain: chains[key] },
        networkId extends config["chains"][number]["id"] ? never : "networkId"
      >
    >;
  };
}[number];

export type SimulateContractErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // @/lib/connect/viem
  | viem_SimulateContractErrorType;

/** https://wagmi.sh/core/api/actions/simulateContract */
export async function simulateContract<
  config extends Config,
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<
    abi,
    "nonpayable" | "payable",
    functionName
  >,
  networkId extends config["chains"][number]["id"] | undefined = undefined
>(
  config: config,
  parameters: SimulateContractParameters<
    abi,
    functionName,
    args,
    config,
    networkId
  >
): Promise<
  SimulateContractReturnType<abi, functionName, args, config, networkId>
> {
  const { abi, networkId, connector, ...rest } =
    parameters as SimulateContractParameters;

  let account: Address | Account;
  if (parameters.account) account = parameters.account;
  else {
    const connectorClient = await getConnectorClient(config, {
      networkId,
      connector,
    });
    account = connectorClient.account;
  }

  const client = config.getClient({ networkId });
  const action = getAction(client, viem_simulateContract, "simulateContract");
  const { result, request } = await action({ ...rest, abi, account });

  return {
    networkId: client.chain.id,
    result,
    request: { __mode: "prepared", ...request, networkId },
  } as unknown as SimulateContractReturnType<
    abi,
    functionName,
    args,
    config,
    networkId
  >;
}
