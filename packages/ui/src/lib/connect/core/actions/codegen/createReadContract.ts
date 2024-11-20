import type {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";

import type { Config } from "../../createConfig";
import type { UnionCompute, UnionStrictOmit } from "../../types/utils";
import { getAccount } from "../getAccount";
import { getChainId } from "../getChainId";
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
  omittedProperties extends "abi" | "address" | "chainId" | "functionName" =
    | "abi"
    | (address extends undefined ? never : "address")
    | (address extends Record<string, Address> ? "chainId" : never)
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
      ? { chainId?: keyof address | undefined }
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
      const configChainId = getChainId(config);
      const account = getAccount(config);
      const chainId =
        (parameters as { chainId?: string })?.chainId ??
        account.chainId ??
        configChainId;
      return readContract(config, {
        ...(parameters as any),
        ...(c.functionName ? { functionName: c.functionName } : {}),
        address: (c.address as Record<string, Address> | undefined)?.[chainId],
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
