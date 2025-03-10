import type { MutationOptions } from '@tanstack/query-core'

import {
  type ReconnectErrorType,
  type ReconnectParameters,
  type ReconnectReturnType,
  reconnect,
} from '../actions/reconnect'
import type { Config } from '../createConfig'
import type { Compute } from '../types/utils'
import type { Mutate, MutateAsync } from './types'

export function reconnectMutationOptions(config: Config) {
  return {
    mutationFn(variables) {
      return reconnect(config, variables)
    },
    mutationKey: ['reconnect'],
  } as const satisfies MutationOptions<
    ReconnectData,
    ReconnectErrorType,
    ReconnectVariables
  >
}

export type ReconnectData = Compute<ReconnectReturnType>

export type ReconnectVariables = ReconnectParameters | undefined

export type ReconnectMutate<context = unknown> = Mutate<
  ReconnectData,
  ReconnectErrorType,
  ReconnectVariables,
  context
>

export type ReconnectMutateAsync<context = unknown> = MutateAsync<
  ReconnectData,
  ReconnectErrorType,
  ReconnectVariables,
  context
>
