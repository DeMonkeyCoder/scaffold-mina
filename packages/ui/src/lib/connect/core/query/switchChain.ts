import type { MutateOptions, MutationOptions } from '@tanstack/query-core'

import {
  type SwitchChainErrorType,
  type SwitchChainParameters,
  type SwitchChainReturnType,
  switchChain,
} from '../actions/switchChain'
import type { Config } from '../createConfig'
import type { Compute } from '../types/utils'

export function switchChainMutationOptions<config extends Config>(
  config: config,
) {
  return {
    mutationFn(variables) {
      return switchChain(config, variables)
    },
    mutationKey: ['switchChain'],
  } as const satisfies MutationOptions<
    SwitchChainData<config, config['chains'][number]['id']>,
    SwitchChainErrorType,
    SwitchChainVariables<config, config['chains'][number]['id']>
  >
}

export type SwitchChainData<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = Compute<SwitchChainReturnType<config, networkId>>

export type SwitchChainVariables<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = Compute<SwitchChainParameters<config, networkId>>

export type SwitchChainMutate<config extends Config, context = unknown> = <
  networkId extends config['chains'][number]['id'],
>(
  variables: SwitchChainVariables<config, networkId>,
  options?:
    | Compute<
        MutateOptions<
          SwitchChainData<config, networkId>,
          SwitchChainErrorType,
          Compute<SwitchChainVariables<config, networkId>>,
          context
        >
      >
    | undefined,
) => void

export type SwitchChainMutateAsync<config extends Config, context = unknown> = <
  networkId extends config['chains'][number]['id'],
>(
  variables: SwitchChainVariables<config, networkId>,
  options?:
    | Compute<
        MutateOptions<
          SwitchChainData<config, networkId>,
          SwitchChainErrorType,
          Compute<SwitchChainVariables<config, networkId>>,
          context
        >
      >
    | undefined,
) => Promise<SwitchChainData<config, networkId>>
