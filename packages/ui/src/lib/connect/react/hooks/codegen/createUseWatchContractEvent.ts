import type {
  Config,
  ResolvedRegister,
  WatchContractEventParameters,
} from "@/lib/connect/core/exports";
import type {
  UnionCompute,
  UnionExactPartial,
  UnionStrictOmit,
} from "@/lib/connect/core/exports/internal";
import type { Abi, Address, ContractEventName } from "@/lib/connect/viem";

import type { ConfigParameter, EnabledParameter } from "../../types/properties";
import { useAccount } from "../useAccount";
import { useChainId } from "../useChainId";
import { useConfig } from "../useConfig";
import { useWatchContractEvent } from "../useWatchContractEvent";

export type CreateUseWatchContractEventParameters<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined = undefined,
  eventName extends ContractEventName<abi> | undefined = undefined
> = {
  abi: abi | Abi | readonly unknown[];
  address?: address | Address | Record<string, Address> | undefined;
  eventName?: eventName | ContractEventName<abi> | undefined;
};

export type CreateUseWatchContractEventReturnType<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined,
  eventName extends ContractEventName<abi> | undefined,
  ///
  omittedProperties extends "abi" | "address" | "chainId" | "eventName" =
    | "abi"
    | (address extends undefined ? never : "address")
    | (address extends Record<string, Address> ? "chainId" : never)
    | (eventName extends undefined ? never : "eventName")
> = <
  name extends eventName extends ContractEventName<abi>
    ? eventName
    : ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  parameters?: UnionCompute<
    UnionExactPartial<
      UnionStrictOmit<
        WatchContractEventParameters<abi, name, strict, config, chainId>,
        omittedProperties
      >
    > &
      ConfigParameter<config> &
      EnabledParameter
  > &
    (address extends Record<string, Address>
      ? { chainId?: keyof address | undefined }
      : unknown)
) => void;

export function createUseWatchContractEvent<
  const abi extends Abi | readonly unknown[],
  const address extends
    | Address
    | Record<string, Address>
    | undefined = undefined,
  eventName extends ContractEventName<abi> | undefined = undefined
>(
  props: CreateUseWatchContractEventParameters<abi, address, eventName>
): CreateUseWatchContractEventReturnType<abi, address, eventName> {
  if (props.address !== undefined && typeof props.address === "object")
    return (parameters) => {
      const config = useConfig(parameters);
      const configChainId = useChainId({ config });
      const account = useAccount({ config });
      const chainId =
        (parameters as { chainId?: number })?.chainId ??
        account.chainId ??
        configChainId;
      return useWatchContractEvent({
        ...(parameters as any),
        ...(props.eventName ? { eventName: props.eventName } : {}),
        address: props.address?.[chainId],
        abi: props.abi,
      });
    };

  return (parameters) => {
    return useWatchContractEvent({
      ...(parameters as any),
      ...(props.address ? { address: props.address } : {}),
      ...(props.eventName ? { eventName: props.eventName } : {}),
      abi: props.abi,
    });
  };
}
