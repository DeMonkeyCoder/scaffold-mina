import type { MutationOptions } from '@tanstack/query-core'

import {
  type DisconnectErrorType,
  type DisconnectParameters,
  type DisconnectReturnType,
  disconnect,
} from '../actions/disconnect'
import type { Config } from '../createConfig'
import type { Mutate, MutateAsync } from './types'

export function disconnectMutationOptions<config extends Config>(
  config: config,
) {
  return {
    mutationFn(variables) {
      return disconnect(config, variables)
    },
    mutationKey: ['disconnect'],
  } as const satisfies MutationOptions<
    DisconnectData,
    DisconnectErrorType,
    DisconnectVariables
  >
}

export type DisconnectData = DisconnectReturnType

export type DisconnectVariables = DisconnectParameters | undefined

export type DisconnectMutate<context = unknown> = Mutate<
  DisconnectData,
  DisconnectErrorType,
  DisconnectVariables,
  context
>

export type DisconnectMutateAsync<context = unknown> = MutateAsync<
  DisconnectData,
  DisconnectErrorType,
  DisconnectVariables,
  context
>
