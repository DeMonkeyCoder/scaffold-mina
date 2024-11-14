"use client";

import { useMutation } from "@tanstack/react-query";
import type { WatchAssetErrorType } from "@/lib/connect/core/exports";
import type { Compute } from "@/lib/connect/core/exports/internal";
import {
  type WatchAssetData,
  type WatchAssetMutate,
  type WatchAssetMutateAsync,
  type WatchAssetVariables,
  watchAssetMutationOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter } from "../types/properties";
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from "../utils/query";
import { useConfig } from "./useConfig";

export type UseWatchAssetParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?:
      | UseMutationParameters<
          WatchAssetData,
          WatchAssetErrorType,
          WatchAssetVariables,
          context
        >
      | undefined;
  }
>;

export type UseWatchAssetReturnType<context = unknown> = Compute<
  UseMutationReturnType<
    WatchAssetData,
    WatchAssetErrorType,
    WatchAssetVariables,
    context
  > & {
    watchAsset: WatchAssetMutate<context>;
    watchAssetAsync: WatchAssetMutateAsync<context>;
  }
>;

/** https://wagmi.sh/react/api/hooks/useWatchAsset */
export function useWatchAsset<context = unknown>(
  parameters: UseWatchAssetParameters<context> = {}
): UseWatchAssetReturnType<context> {
  const { mutation } = parameters;

  const config = useConfig(parameters);

  const mutationOptions = watchAssetMutationOptions(config);
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  });

  return {
    ...result,
    watchAsset: mutate,
    watchAssetAsync: mutateAsync,
  };
}
