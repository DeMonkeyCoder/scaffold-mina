'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  ResolvedRegister,
  SignTransactionErrorType,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type SignZkappTransactionData,
  type SignZkappTransactionMutate,
  type SignZkappTransactionMutateAsync,
  signZkappTransactionMutationOptions,
  type SignZkappTransactionVariables,
} from '@/lib/connect/core/exports/query'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useConfig } from './useConfig'

export type UseSignZkappTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignZkappTransactionData,
          SignTransactionErrorType,
          SignZkappTransactionVariables<config, config['chains'][number]['id']>,
          context
        >
      | undefined
  }
>

export type UseSignZkappTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SignZkappTransactionData,
    SignTransactionErrorType,
    SignZkappTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    signTransaction: SignZkappTransactionMutate<config, context>
    signTransactionAsync: SignZkappTransactionMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSignTransaction */
export function useSignZkappTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSignZkappTransactionParameters<config, context> = {},
): UseSignZkappTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = signZkappTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSignZkappTransactionReturnType<config, context>
  return {
    ...result,
    signTransaction: mutate as Return['signTransaction'],
    signTransactionAsync: mutateAsync as Return['signTransactionAsync'],
  }
}
