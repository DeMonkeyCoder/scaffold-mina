import type { MutationOptions } from '@tanstack/query-core'

import {
  type WatchAssetErrorType,
  type WatchAssetParameters,
  type WatchAssetReturnType,
  watchAsset,
} from '../actions/watchAsset'
import type { Config } from '../createConfig'
import type { Compute } from '../types/utils'
import type { Mutate, MutateAsync } from './types'

export function watchAssetMutationOptions(config: Config) {
  return {
    mutationFn(variables) {
      return watchAsset(config, variables)
    },
    mutationKey: ['watchAsset'],
  } as const satisfies MutationOptions<
    WatchAssetData,
    WatchAssetErrorType,
    WatchAssetVariables
  >
}

export type WatchAssetData = WatchAssetReturnType

export type WatchAssetVariables = Compute<WatchAssetParameters>

export type WatchAssetMutate<context = unknown> = Mutate<
  WatchAssetData,
  WatchAssetErrorType,
  WatchAssetVariables,
  context
>

export type WatchAssetMutateAsync<context = unknown> = MutateAsync<
  WatchAssetData,
  WatchAssetErrorType,
  WatchAssetVariables,
  context
>
