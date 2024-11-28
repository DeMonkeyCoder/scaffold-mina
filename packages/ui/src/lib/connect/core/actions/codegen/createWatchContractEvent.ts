import type { Abi, Address, ContractEventName } from "@/lib/connect/viem";

import type { Config } from "../../createConfig";
import type { UnionCompute, UnionStrictOmit } from "../../types/utils";
import { getAccount } from "../getAccount";
import { getNetworkId } from "../getNetworkId";
import {
  watchContractEvent,
  type WatchContractEventParameters,
  type WatchContractEventReturnType,
} from "../watchContractEvent";

export type CreateWatchContractEventParameters<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined = undefined,
  eventName extends ContractEventName<abi> | undefined = undefined
> = {
  abi: abi | Abi | readonly unknown[];
  address?: address | Address | Record<string, Address> | undefined;
  eventName?: eventName | ContractEventName<abi> | undefined;
};

export type CreateWatchContractEventReturnType<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<string, Address> | undefined,
  eventName extends ContractEventName<abi> | undefined,
  ///
  omittedProperties extends "abi" | "address" | "networkId" | "eventName" =
    | "abi"
    | (address extends undefined ? never : "address")
    | (address extends Record<string, Address> ? "networkId" : never)
    | (eventName extends undefined ? never : "eventName")
> = <
  config extends Config,
  name extends eventName extends ContractEventName<abi>
    ? eventName
    : ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  config: config,
  parameters: UnionCompute<
    UnionStrictOmit<
      WatchContractEventParameters<abi, name, strict, config, networkId>,
      omittedProperties
    >
  > &
    (address extends Record<string, Address>
      ? { networkId?: keyof address | undefined }
      : unknown)
) => WatchContractEventReturnType;

export function createWatchContractEvent<
  const abi extends Abi | readonly unknown[],
  const address extends
    | Address
    | Record<string, Address>
    | undefined = undefined,
  eventName extends ContractEventName<abi> | undefined = undefined
>(
  c: CreateWatchContractEventParameters<abi, address, eventName>
): CreateWatchContractEventReturnType<abi, address, eventName> {
  if (c.address !== undefined && typeof c.address === "object")
    return (config, parameters) => {
      const configNetworkId = getNetworkId(config);
      const account = getAccount(config);
      const networkId =
        (parameters as { networkId?: string })?.networkId ??
        account.networkId ??
        configNetworkId;
      return watchContractEvent(config, {
        ...(parameters as any),
        ...(c.eventName ? { functionName: c.eventName } : {}),
        address: (c.address as Record<string, Address> | undefined)?.[
          networkId
        ],
        abi: c.abi,
      });
    };

  return (config, parameters) => {
    return watchContractEvent(config, {
      ...(parameters as any),
      ...(c.address ? { address: c.address } : {}),
      ...(c.eventName ? { functionName: c.eventName } : {}),
      abi: c.abi,
    });
  };
}
