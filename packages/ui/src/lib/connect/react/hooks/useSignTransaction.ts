'use client'

import type {Config, ResolvedRegister, SignTransactionErrorType,} from '@/lib/connect/core/exports'
import type {Compute} from '@/lib/connect/core/exports/internal'
import type {
  SignTransactionData,
  SignTransactionMutate,
  SignTransactionMutateAsync,
  SignTransactionVariables,
} from '@/lib/connect/core/exports/query'
import {signPaymentTransactionMutationOptions} from '@/lib/connect/core/query/signTransaction'
import type {TransactionType} from '@/lib/connect/viem'
import {TransactionTypeNotSupportedError} from '@/lib/connect/viem/actions/wallet/sendTransaction'
import {useMutation} from '@tanstack/react-query'
import type {ConfigParameter} from '../types/properties'
import type {UseMutationParameters, UseMutationReturnType,} from '../utils/query'
import {useConfig} from './useConfig'

export type UseSignTransactionParameters<
  transactionType extends TransactionType,
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignTransactionData<transactionType>,
          SignTransactionErrorType,
          SignTransactionVariables<
            transactionType,
            config,
            config['chains'][number]['id']
          >,
          context
        >
      | undefined
  }
>

export type UseSignTransactionReturnType<
  transactionType extends TransactionType,
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SignTransactionData<transactionType>,
    SignTransactionErrorType,
    SignTransactionVariables<
      transactionType,
      config,
      config['chains'][number]['id']
    >,
    context
  > & {
    signTransaction: SignTransactionMutate<transactionType, config, context>
    signTransactionAsync: SignTransactionMutateAsync<
      transactionType,
      config,
      context
    >
  }
>

/** https://wagmi.sh/react/api/hooks/useSignTransaction */
export function useSignTransaction<
  transactionType extends TransactionType,
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  transactionType: transactionType,
  parameters: UseSignTransactionParameters<
    transactionType,
    config,
    context
  > = {},
): UseSignTransactionReturnType<transactionType, config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)
  if (transactionType === 'payment') {
    const mutationOptions = signPaymentTransactionMutationOptions(config)
    const ret = useMutation({
      ...mutation,
      ...mutationOptions,
    })
    const { mutate, mutateAsync, ...result } = ret
    const mututu = ret.mutateAsync
    const stx: SignTransactionMutateAsync<'payment', config, unknown> = mututu
    return {
      ...result,
      signTransaction: mutate,
      signTransactionAsync: mutateAsync,
    }
  }

  throw new TransactionTypeNotSupportedError({
    type: transactionType,
  })
}
