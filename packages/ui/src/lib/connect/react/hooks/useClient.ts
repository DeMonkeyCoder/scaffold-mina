"use client";

import {
  type Config,
  getClient,
  type GetClientParameters,
  type GetClientReturnType,
  type ResolvedRegister,
  watchClient,
} from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

import type { ConfigParameter } from "../types/properties";
import { useConfig } from "./useConfig";

export type UseClientParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] | string | undefined =
    | config["chains"][number]["id"]
    | undefined
> = Compute<GetClientParameters<config, chainId> & ConfigParameter<config>>;

export type UseClientReturnType<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] | string | undefined =
    | config["chains"][number]["id"]
    | undefined
> = GetClientReturnType<config, chainId>;

/** https://wagmi.sh/react/api/hooks/useClient */
export function useClient<
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | string | undefined =
    | config["chains"][number]["id"]
    | undefined
>(
  parameters: UseClientParameters<config, chainId> = {}
): UseClientReturnType<config, chainId> {
  const config = useConfig(parameters);

  return useSyncExternalStoreWithSelector(
    (onChange) => watchClient(config, { onChange }),
    () => getClient(config, parameters),
    () => getClient(config, parameters),
    (x) => x,
    (a, b) => a?.uid === b?.uid
  ) as any;
}
