"use client";

import {
  type Config,
  getPublicClient,
  type GetPublicClientParameters,
  type GetPublicClientReturnType,
  type ResolvedRegister,
  watchPublicClient,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

import type { ConfigParameter } from "../types/properties";
import { useConfig } from "./useConfig";

export type UsePublicClientParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] | string | undefined =
    | config["chains"][number]["id"]
    | undefined
> = Compute<
  GetPublicClientParameters<config, chainId> & ConfigParameter<config>
>;

export type UsePublicClientReturnType<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] | string | undefined =
    | config["chains"][number]["id"]
    | undefined
> = GetPublicClientReturnType<config, chainId>;

/** https://wagmi.sh/react/api/hooks/usePublicClient */
export function usePublicClient<
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | string | undefined =
    | config["chains"][number]["id"]
    | undefined
>(
  parameters: UsePublicClientParameters<config, chainId> = {}
): UsePublicClientReturnType<config, chainId> {
  const config = useConfig(parameters);

  return useSyncExternalStoreWithSelector(
    (onChange) => watchPublicClient(config, { onChange }),
    () => getPublicClient(config, parameters),
    () => getPublicClient(config, parameters),
    (x) => x,
    (a, b) => a?.uid === b?.uid
  ) as any;
}
