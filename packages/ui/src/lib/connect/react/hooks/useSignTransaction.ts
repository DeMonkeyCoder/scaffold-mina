'use client'

import type {Config, ResolvedRegister, SignTransactionErrorType,} from '@/lib/connect/core/exports'
import type {Compute} from '@/lib/connect/core/exports/internal'
import {
  type SignTransactionData,
  type SignTransactionMutate,
  type SignTransactionMutateAsync,
  type SignTransactionVariables,
} from '@/lib/connect/core/exports/query'
import {useMutation} from '@tanstack/react-query'
import type {ConfigParameter} from '../types/properties'
import type {UseMutationParameters, UseMutationReturnType,} from '../utils/query'
import {useConfig} from './useConfig'
import {TransactionTypeNotSupportedError} from "@/lib/connect/viem/actions/wallet/sendTransaction";
import {signPaymentTransactionMutationOptions} from "@/lib/connect/core/query/signTransaction";
import type {TransactionType} from "@/lib/connect/viem";

export type UseSignTransactionParameters<
  transactionType extends TransactionType,
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignTransactionData<'payment'>,
          SignTransactionErrorType,
          SignTransactionVariables<
            'payment',
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
    SignTransactionData<'payment'>,
    SignTransactionErrorType,
    SignTransactionVariables<'payment', config, config['chains'][number]['id']>,
    context
  > & {
    signTransaction: SignTransactionMutate<'payment', config, context>
    signTransactionAsync: SignTransactionMutateAsync<'payment', config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSignTransaction */
export function useSignTransaction<
  transactionType extends 'zkapp',
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  transactionType: 'payment',
  parameters: UseSignTransactionParameters<'payment', config, context> = {},
): UseSignTransactionReturnType<'payment', config, context> {
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
    const stx: SignTransactionMutateAsync<'payment', config, context> = mututu
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
