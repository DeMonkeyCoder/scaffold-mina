'use client'

import {useMutation} from '@tanstack/react-query'
import type {Config, ResolvedRegister, SignTransactionErrorType} from '@/lib/connect/core/exports'
import type {Compute} from '@/lib/connect/core/exports/internal'
import {
  type SignTransactionData,
  type SignTransactionMutate,
  type SignTransactionMutateAsync,
  signTransactionMutationOptions,
  type SignTransactionVariables,
} from '@/lib/connect/core/exports/query'

import type {ConfigParameter} from '../types/properties'
import type {UseMutationParameters, UseMutationReturnType,} from '../utils/query'
import {useConfig} from './useConfig'

export type UseSignTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignTransactionData,
          SignTransactionErrorType,
          SignTransactionVariables<config, config['chains'][number]['id']>,
          context
        >
      | undefined
  }
>

export type UseSignTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SignTransactionData,
    SignTransactionErrorType,
    SignTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    signTransaction: SignTransactionMutate<config, context>
    signTransactionAsync: SignTransactionMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSignTransaction */
export function useSignTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSignTransactionParameters<config, context> = {},
): UseSignTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = signTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  return {
    ...result,
    signTransaction: mutate,
    signTransactionAsync: mutateAsync,
  }
}
