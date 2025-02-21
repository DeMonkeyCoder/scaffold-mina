'use client'

import type {
  Config,
  ResolvedRegister,
  SendSignedTransactionErrorType,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type SendSignedTransactionData,
  type SendSignedTransactionMutate,
  type SendSignedTransactionMutateAsync,
  sendSignedTransactionMutationOptions,
  type SendSignedTransactionVariables,
} from '@/lib/connect/core/exports/query'
import { useMutation } from '@tanstack/react-query'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useConfig } from './useConfig'

export type UseSendSignedTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SendSignedTransactionData,
          SendSignedTransactionErrorType,
          SendSignedTransactionVariables<
            config,
            config['chains'][number]['id']
          >,
          context
        >
      | undefined
  }
>

export type UseSendSignedTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SendSignedTransactionData,
    SendSignedTransactionErrorType,
    SendSignedTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    sendSignedTransaction: SendSignedTransactionMutate<config, context>
    sendSignedTransactionAsync: SendSignedTransactionMutateAsync<
      config,
      context
    >
  }
>

/** https://wagmi.sh/react/api/hooks/useSendSignedTransaction */
export function useSendSignedTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSendSignedTransactionParameters<config, context> = {},
): UseSendSignedTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = sendSignedTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSendSignedTransactionReturnType<config, context>
  return {
    ...result,
    sendSignedTransaction: mutate as Return['sendSignedTransaction'],
    sendSignedTransactionAsync:
      mutateAsync as Return['sendSignedTransactionAsync'],
  }
}
