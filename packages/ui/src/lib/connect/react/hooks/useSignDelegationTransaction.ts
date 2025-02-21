'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  ResolvedRegister,
  SignTransactionErrorType,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type SignDelegationTransactionData,
  type SignDelegationTransactionMutate,
  type SignDelegationTransactionMutateAsync,
  signDelegationTransactionMutationOptions,
  type SignDelegationTransactionVariables,
} from '@/lib/connect/core/exports/query'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useConfig } from './useConfig'

export type UseSignDelegationTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignDelegationTransactionData,
          SignTransactionErrorType,
          SignDelegationTransactionVariables<
            config,
            config['chains'][number]['id']
          >,
          context
        >
      | undefined
  }
>

export type UseSignDelegationTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SignDelegationTransactionData,
    SignTransactionErrorType,
    SignDelegationTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    signTransaction: SignDelegationTransactionMutate<config, context>
    signTransactionAsync: SignDelegationTransactionMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSignTransaction */
export function useSignDelegationTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSignDelegationTransactionParameters<config, context> = {},
): UseSignDelegationTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = signDelegationTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSignDelegationTransactionReturnType<config, context>
  return {
    ...result,
    signTransaction: mutate as Return['signTransaction'],
    signTransactionAsync: mutateAsync as Return['signTransactionAsync'],
  }
}
