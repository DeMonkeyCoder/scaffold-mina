import type { MutateOptions, MutationOptions } from '@tanstack/query-core'
import {
  signTransaction,
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
} from '../actions/signTransaction'
import type { Config } from '../createConfig'
import type { Compute } from '../types/utils'

export function signPaymentTransactionMutationOptions<config extends Config>(
  config: config,
) {
  return {
    mutationFn(variables) {
      return signTransaction(config, {
        ...variables,
        type: 'payment',
      } as SignTransactionParameters<
        'payment',
        config,
        config['chains'][number]['id']
      >)
    },
    mutationKey: ['signTransaction'],
  } as const satisfies MutationOptions<
    SignPaymentTransactionData,
    SignTransactionErrorType,
    SignPaymentTransactionVariables<config, config['chains'][number]['id']>
  >
}

export type SignPaymentTransactionData = Compute<
  SignTransactionReturnType<'payment'>
>

export type SignPaymentTransactionVariables<
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = Omit<SignTransactionParameters<'payment', config, chainId>, 'type'>

export type SignPaymentTransactionMutate<
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SignPaymentTransactionVariables<config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SignPaymentTransactionData,
          SignTransactionErrorType,
          Compute<SignPaymentTransactionVariables<config, chainId>>,
          context
        >
      >
    | undefined,
) => void

export type SignPaymentTransactionMutateAsync<
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SignPaymentTransactionVariables<config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SignPaymentTransactionData,
          SignTransactionErrorType,
          Compute<SignPaymentTransactionVariables<config, chainId>>,
          context
        >
      >
    | undefined,
) => Promise<SignPaymentTransactionData>
