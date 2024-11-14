import {
  type Client,
  type PublicClient,
  publicActions,
} from "@/lib/connect/viem";

import type { Config } from "../createConfig";
import type { ChainIdParameter } from "../types/properties";
import type { Compute, IsNarrowable } from "../types/utils";
import { getClient } from "./getClient";

export type GetPublicClientParameters<
  config extends Config = Config,
  chainId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"]
> = ChainIdParameter<config, chainId>;

export type GetPublicClientReturnType<
  config extends Config = Config,
  chainId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  ///
  resolvedChainId extends
    | config["chains"][number]["id"]
    | undefined = IsNarrowable<
    config["chains"][number]["id"],
    number
  > extends true
    ? IsNarrowable<chainId, number> extends true
      ? chainId
      : config["chains"][number]["id"]
    : config["chains"][number]["id"] | undefined
> = resolvedChainId extends config["chains"][number]["id"]
  ? Compute<
      PublicClient<
        config["_internal"]["transports"][resolvedChainId],
        Extract<config["chains"][number], { id: resolvedChainId }>
      >
    >
  : undefined;

export function getPublicClient<
  config extends Config,
  chainId extends config["chains"][number]["id"] | number | undefined
>(
  config: config,
  parameters: GetPublicClientParameters<config, chainId> = {}
): GetPublicClientReturnType<config, chainId> {
  const client = getClient(config, parameters);
  return (client as Client)?.extend(publicActions) as GetPublicClientReturnType<
    config,
    chainId
  >;
}
