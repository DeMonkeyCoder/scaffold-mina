import type {MutationOptions} from '@tanstack/query-core'

import type {TransactionType} from '@/lib/connect/viem'
import {
  signTransaction,
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
} from '../actions/signTransaction'
import type {Config} from '../createConfig'
import type {Compute} from '../types/utils'
import type {Mutate, MutateAsync} from './types'

export function signTransactionMutationOptions<
  transactionType extends TransactionType,
  config extends Config,
>(transactionType: transactionType, config: config) {
  if (transactionType === 'zkapp') {
    return {
      mutationFn(variables) {
        return signTransaction(config, variables)
      },
      mutationKey: ['signTransaction'],
    } as const satisfies MutationOptions<
      SignTransactionData<'zkapp'>,
      SignTransactionErrorType,
      SignTransactionVariables<'zkapp', config, config['chains'][number]['id']>
    >
  }
  if (transactionType === 'payment') {
    return {
      mutationFn(variables) {
        return signTransaction(config, variables)
      },
      mutationKey: ['signTransaction'],
    } as const satisfies MutationOptions<
      SignTransactionData<'payment'>,
      SignTransactionErrorType,
      SignTransactionVariables<
        'payment',
        config,
        config['chains'][number]['id']
      >
    >
  }
  if (transactionType === 'delegation') {
    return {
      mutationFn(variables) {
        return signTransaction(config, variables)
      },
      mutationKey: ['signTransaction'],
    } as const satisfies MutationOptions<
      SignTransactionData<'delegation'>,
      SignTransactionErrorType,
      SignTransactionVariables<
        'delegation',
        config,
        config['chains'][number]['id']
      >
    >
  }
}

export function signPaymentTransactionMutationOptions<config extends Config>(
  config: config,
) {
  return {
    mutationFn(variables) {
      return signTransaction(config, variables)
    },
    mutationKey: ['signTransaction'],
  } as const satisfies MutationOptions<
    SignTransactionData<'payment'>,
    SignTransactionErrorType,
    SignTransactionVariables<'payment', config, config['chains'][number]['id']>
  >
}

export type SignTransactionData<transactionType extends TransactionType> =
  Compute<SignTransactionReturnType<transactionType>>

export type SignTransactionVariables<
  transactionType extends TransactionType,
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = SignTransactionParameters<transactionType, config, chainId>

export type SignTransactionMutate<
  transactionType extends TransactionType,
  config extends Config,
  context = unknown,
> = Mutate<
  SignTransactionData<'payment'>,
  SignTransactionErrorType,
  SignTransactionVariables<'payment', config, config['chains'][number]['id']>,
  context
>

export type SignTransactionMutateAsync<
  transactionType extends TransactionType,
  config extends Config,
  context = unknown,
> = MutateAsync<
  SignTransactionData<'payment'>,
  SignTransactionErrorType,
  SignTransactionVariables<'payment', config, config['chains'][number]['id']>,
  context
>
