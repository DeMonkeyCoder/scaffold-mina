import type {
  Abi,
  Account,
  Address,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
  SimulateContractParameters as viem_SimulateContractParameters,
} from "@/lib/connect/viem";

import type { Config } from "../../createConfig";
import type { SelectChains } from "../../types/chain";
import type {
  ChainIdParameter,
  ConnectorParameter,
} from "../../types/properties";
import type { UnionCompute, UnionStrictOmit } from "../../types/utils";
import { getAccount } from "../getAccount";
import { getChainId } from "../getChainId";
import {
  simulateContract,
  type SimulateContractReturnType,
} from "../simulateContract";

type stateMutability = "nonpayable" | "payable";

export type CreateSimulateContractParameters<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined
> = {
  abi: abi | Abi | readonly unknown[];
  address?: address | Address | Record<string, Address> | undefined;
  functionName?:
    | functionName
    | ContractFunctionName<abi, stateMutability>
    | undefined;
};

export type CreateSimulateContractReturnType<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined,
  functionName extends ContractFunctionName<abi, stateMutability> | undefined
> = <
  config extends Config,
  name extends functionName extends ContractFunctionName<abi, stateMutability>
    ? functionName
    : ContractFunctionName<abi, stateMutability>,
  args extends ContractFunctionArgs<abi, stateMutability, name>,
  chainId extends config["chains"][number]["id"] | undefined = undefined,
  ///
  chains extends readonly Chain[] = SelectChains<config, chainId>
>(
  config: config,
  parameters: {
    [key in keyof chains]: UnionCompute<
      UnionStrictOmit<
        viem_SimulateContractParameters<
          abi,
          name,
          args,
          chains[key],
          chains[key],
          Account | Address
        >,
        | "abi"
        | "chain"
        | (address extends undefined ? never : "address")
        | (functionName extends undefined ? never : "functionName")
      >
    > &
      ChainIdParameter<config, chainId> &
      ConnectorParameter & {
        chainId?: address extends Record<string, Address>
          ?
              | keyof address
              | (chainId extends keyof address ? chainId : never)
              | undefined
          : chainId | number | undefined;
      };
  }[number]
) => Promise<SimulateContractReturnType<abi, name, args, config, chainId>>;

export function createSimulateContract<
  const abi extends Abi | readonly unknown[],
  const address extends
    | Address
    | Record<string, Address>
    | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined
>(
  c: CreateSimulateContractParameters<abi, address, functionName>
): CreateSimulateContractReturnType<abi, address, functionName> {
  if (c.address !== undefined && typeof c.address === "object")
    return (config, parameters) => {
      const configChainId = getChainId(config);
      const account = getAccount(config);
      const chainId =
        (parameters as { chainId?: number })?.chainId ??
        account.chainId ??
        configChainId;
      return simulateContract(config, {
        ...(parameters as any),
        ...(c.functionName ? { functionName: c.functionName } : {}),
        address: (c.address as Record<string, Address> | undefined)?.[chainId],
        abi: c.abi,
      });
    };

  return (config, parameters) => {
    return simulateContract(config, {
      ...(parameters as any),
      ...(c.address ? { address: c.address } : {}),
      ...(c.functionName ? { functionName: c.functionName } : {}),
      abi: c.abi,
    });
  };
}
