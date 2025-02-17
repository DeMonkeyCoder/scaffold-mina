import type {MutateOptions, MutationOptions} from '@tanstack/query-core'

import type {TransactionType} from '@/lib/connect/viem'
import {
    sendTransaction,
    type SendTransactionErrorType,
    type SendTransactionParameters,
    type SendTransactionReturnType,
} from '../actions/sendTransaction'
import type {Config} from '../createConfig'
import type {Compute} from '../types/utils'

export function sendTransactionMutationOptions<
  transactionType extends TransactionType,
  config extends Config,
>(config: config) {
  return {
    mutationFn(variables) {
      return sendTransaction(
        config,
        variables as SendTransactionVariables<
          transactionType,
          config,
          config['chains'][number]['id']
        >,
      )
    },
    mutationKey: ['sendTransaction'],
  } as const satisfies MutationOptions<
    SendTransactionData,
    SendTransactionErrorType,
    SendTransactionVariables<
      transactionType,
      config,
      config['chains'][number]['id']
    >
  >
}

export type SendTransactionData = Compute<SendTransactionReturnType>

export type SendTransactionVariables<
  transactionType extends TransactionType,
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = SendTransactionParameters<transactionType, config, chainId>

export type SendTransactionMutate<config extends Config, context = unknown> = <
  transactionType extends TransactionType,
  chainId extends config['chains'][number]['id'],
>(
  variables: SendTransactionVariables<transactionType, config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SendTransactionData,
          SendTransactionErrorType,
          Compute<SendTransactionVariables<transactionType, config, chainId>>,
          context
        >
      >
    | undefined,
) => void

export type SendTransactionMutateAsync<
  transactionType extends TransactionType,
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SendTransactionVariables<transactionType, config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SendTransactionData,
          SendTransactionErrorType,
          Compute<SendTransactionVariables<transactionType, config, chainId>>,
          context
        >
      >
    | undefined,
) => Promise<SendTransactionData>
