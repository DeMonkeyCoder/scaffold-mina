import type {
  Config,
  ReadContractErrorType,
  ReadContractParameters,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import type {
  ScopeKeyParameter,
  UnionCompute,
  UnionExactPartial,
  UnionStrictOmit,
} from "@/lib/connect/core/exports/internal";
import type {
  ReadContractData,
  ReadContractQueryFnData,
  ReadContractQueryKey,
} from "@/lib/connect/core/exports/query";
import type {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
} from "@/lib/connect/viem";

import type { ConfigParameter, QueryParameter } from "../../types/properties";
import { useAccount } from "../useAccount";
import { useChainId } from "../useChainId";
import { useConfig } from "../useConfig";
import {
  useReadContract,
  type UseReadContractReturnType,
} from "../useReadContract";

type stateMutability = "pure" | "view";

export type CreateUseReadContractParameters<
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

export type CreateUseReadContractReturnType<
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
  name extends functionName extends ContractFunctionName<abi, stateMutability>
    ? functionName
    : ContractFunctionName<abi, stateMutability>,
  args extends ContractFunctionArgs<abi, stateMutability, name>,
  config extends Config = ResolvedRegister["config"],
  selectData = ReadContractData<abi, name, args>
>(
  parameters?: UnionCompute<
    UnionExactPartial<
      UnionStrictOmit<
        ReadContractParameters<abi, name, args, config>,
        omittedProperties
      >
    > &
      ScopeKeyParameter &
      ConfigParameter<config> &
      QueryParameter<
        ReadContractQueryFnData<abi, name, args>,
        ReadContractErrorType,
        selectData,
        ReadContractQueryKey<abi, name, args, config>
      >
  > &
    (address extends Record<string, Address>
      ? { chainId?: keyof address | undefined }
      : unknown)
) => UseReadContractReturnType<abi, name, args, selectData>;

export function createUseReadContract<
  const abi extends Abi | readonly unknown[],
  const address extends
    | Address
    | Record<string, Address>
    | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined
>(
  props: CreateUseReadContractParameters<abi, address, functionName>
): CreateUseReadContractReturnType<abi, address, functionName> {
  if (props.address !== undefined && typeof props.address === "object")
    return (parameters) => {
      const config = useConfig(parameters);
      const configChainId = useChainId({ config });
      const account = useAccount({ config });
      const chainId =
        (parameters as { chainId?: string })?.chainId ??
        account.chainId ??
        configChainId;
      return useReadContract({
        ...(parameters as any),
        ...(props.functionName ? { functionName: props.functionName } : {}),
        address: props.address?.[chainId],
        abi: props.abi,
      });
    };

  return (parameters) => {
    return useReadContract({
      ...(parameters as any),
      ...(props.address ? { address: props.address } : {}),
      ...(props.functionName ? { functionName: props.functionName } : {}),
      abi: props.abi,
    });
  };
}
