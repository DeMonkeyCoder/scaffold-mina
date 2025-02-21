import type { MutateOptions, MutationOptions } from '@tanstack/query-core'
import {
  signTransaction,
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
} from '../actions/signTransaction'
import type { Config } from '../createConfig'
import type { Compute } from '../types/utils'

export function signZkappTransactionMutationOptions<config extends Config>(
  config: config,
) {
  return {
    mutationFn(variables) {
      return signTransaction(config, {
        ...variables,
        type: 'zkapp',
      } as SignTransactionParameters<
        'zkapp',
        config,
        config['chains'][number]['id']
      >)
    },
    mutationKey: ['signTransaction'],
  } as const satisfies MutationOptions<
    SignZkappTransactionData,
    SignTransactionErrorType,
    SignZkappTransactionVariables<config, config['chains'][number]['id']>
  >
}

export type SignZkappTransactionData = Compute<
  SignTransactionReturnType<'zkapp'>
>

export type SignZkappTransactionVariables<
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = Omit<SignTransactionParameters<'zkapp', config, chainId>, 'type'>

export type SignZkappTransactionMutate<
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SignZkappTransactionVariables<config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SignZkappTransactionData,
          SignTransactionErrorType,
          Compute<SignZkappTransactionVariables<config, chainId>>,
          context
        >
      >
    | undefined,
) => void

export type SignZkappTransactionMutateAsync<
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SignZkappTransactionVariables<config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SignZkappTransactionData,
          SignTransactionErrorType,
          Compute<SignZkappTransactionVariables<config, chainId>>,
          context
        >
      >
    | undefined,
) => Promise<SignZkappTransactionData>
