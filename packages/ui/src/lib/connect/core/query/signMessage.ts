import type { MutationOptions } from '@tanstack/query-core'

import {
  type SignMessageErrorType,
  type SignMessageParameters,
  type SignMessageReturnType,
  signMessage,
} from '../actions/signMessage'
import type { Config } from '../createConfig'
import type { Compute } from '../types/utils'
import type { Mutate, MutateAsync } from './types'

export function signMessageMutationOptions(config: Config) {
  return {
    mutationFn(variables) {
      return signMessage(config, variables)
    },
    mutationKey: ['signMessage'],
  } as const satisfies MutationOptions<
    SignMessageData,
    SignMessageErrorType,
    SignMessageVariables
  >
}

export type SignMessageData = SignMessageReturnType

export type SignMessageVariables = Compute<SignMessageParameters>

export type SignMessageMutate<context = unknown> = Mutate<
  SignMessageData,
  SignMessageErrorType,
  SignMessageVariables,
  context
>

export type SignMessageMutateAsync<context = unknown> = MutateAsync<
  SignMessageData,
  SignMessageErrorType,
  SignMessageVariables,
  context
>
