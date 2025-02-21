'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  ResolvedRegister,
  SignTransactionErrorType,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type SignPaymentTransactionData,
  type SignPaymentTransactionMutate,
  type SignPaymentTransactionMutateAsync,
  signPaymentTransactionMutationOptions,
  type SignPaymentTransactionVariables,
} from '@/lib/connect/core/exports/query'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useConfig } from './useConfig'

export type UseSignPaymentTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignPaymentTransactionData,
          SignTransactionErrorType,
          SignPaymentTransactionVariables<
            config,
            config['chains'][number]['id']
          >,
          context
        >
      | undefined
  }
>

export type UseSignPaymentTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SignPaymentTransactionData,
    SignTransactionErrorType,
    SignPaymentTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    signTransaction: SignPaymentTransactionMutate<config, context>
    signTransactionAsync: SignPaymentTransactionMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSignTransaction */
export function useSignPaymentTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSignPaymentTransactionParameters<config, context> = {},
): UseSignPaymentTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = signPaymentTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSignPaymentTransactionReturnType<config, context>
  return {
    ...result,
    signTransaction: mutate as Return['signTransaction'],
    signTransactionAsync: mutateAsync as Return['signTransactionAsync'],
  }
}
