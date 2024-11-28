import type {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";

import type { Config } from "../../createConfig";
import type { UnionCompute, UnionStrictOmit } from "../../types/utils";
import { getAccount } from "../getAccount";
import { getNetworkId } from "../getNetworkId";
import {
  readContract,
  type ReadContractParameters,
  type ReadContractReturnType,
} from "../readContract";

type stateMutability = "pure" | "view";

export type CreateReadContractParameters<
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

export type CreateReadContractReturnType<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined,
  functionName extends ContractFunctionName<abi, stateMutability> | undefined,
  ///
  omittedProperties extends "abi" | "address" | "networkId" | "functionName" =
    | "abi"
    | (address extends undefined ? never : "address")
    | (address extends Record<string, Address> ? "networkId" : never)
    | (functionName extends undefined ? never : "functionName")
> = <
  config extends Config,
  name extends functionName extends ContractFunctionName<abi, stateMutability>
    ? functionName
    : ContractFunctionName<abi, stateMutability>,
  args extends ContractFunctionArgs<abi, stateMutability, name>
>(
  config: config,
  parameters: UnionCompute<
    UnionStrictOmit<
      ReadContractParameters<abi, name, args, config>,
      omittedProperties
    >
  > &
    (address extends Record<string, Address>
      ? { networkId?: keyof address | undefined }
      : unknown)
) => Promise<ReadContractReturnType<abi, name, args>>;

export function createReadContract<
  const abi extends Abi | readonly unknown[],
  const address extends
    | Address
    | Record<string, Address>
    | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined
>(
  c: CreateReadContractParameters<abi, address, functionName>
): CreateReadContractReturnType<abi, address, functionName> {
  if (c.address !== undefined && typeof c.address === "object")
    return (config, parameters) => {
      const configNetworkId = getNetworkId(config);
      const account = getAccount(config);
      const networkId =
        (parameters as { networkId?: string })?.networkId ??
        account.networkId ??
        configNetworkId;
      return readContract(config, {
        ...(parameters as any),
        ...(c.functionName ? { functionName: c.functionName } : {}),
        address: (c.address as Record<string, Address> | undefined)?.[
          networkId
        ],
        abi: c.abi,
      });
    };

  return (config, parameters) => {
    return readContract(config, {
      ...(parameters as any),
      ...(c.address ? { address: c.address } : {}),
      ...(c.functionName ? { functionName: c.functionName } : {}),
      abi: c.abi,
    });
  };
}
