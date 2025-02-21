'use client'

import type {
  Config,
  ResolvedRegister,
  SendTransactionErrorType,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type SendTransactionData,
  type SendTransactionMutate,
  type SendTransactionMutateAsync,
  sendTransactionMutationOptions,
  type SendTransactionVariables,
} from '@/lib/connect/core/exports/query'
import { useMutation } from '@tanstack/react-query'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useConfig } from './useConfig'

export type UseSendTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SendTransactionData,
          SendTransactionErrorType,
          SendTransactionVariables<config, config['chains'][number]['id']>,
          context
        >
      | undefined
  }
>

export type UseSendTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SendTransactionData,
    SendTransactionErrorType,
    SendTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    sendTransaction: SendTransactionMutate<config, context>
    sendTransactionAsync: SendTransactionMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSendTransaction */
export function useSendTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSendTransactionParameters<config, context> = {},
): UseSendTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = sendTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSendTransactionReturnType<config, context>
  return {
    ...result,
    sendTransaction: mutate as Return['sendTransaction'],
    sendTransactionAsync: mutateAsync as Return['sendTransactionAsync'],
  }
}
