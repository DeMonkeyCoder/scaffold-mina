'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  ResolvedRegister,
  SwitchChainErrorType,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type SwitchChainData,
  type SwitchChainMutate,
  type SwitchChainMutateAsync,
  type SwitchChainVariables,
  switchChainMutationOptions,
} from '@/lib/connect/core/exports/query'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useChains } from './useChains'
import { useConfig } from './useConfig'

export type UseSwitchChainParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SwitchChainData<config, config['chains'][number]['id']>,
          SwitchChainErrorType,
          SwitchChainVariables<config, config['chains'][number]['id']>,
          context
        >
      | undefined
  }
>

export type UseSwitchChainReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SwitchChainData<config, config['chains'][number]['id']>,
    SwitchChainErrorType,
    SwitchChainVariables<config, config['chains'][number]['id']>,
    context
  > & {
    chains: config['chains']
    switchChain: SwitchChainMutate<config, context>
    switchChainAsync: SwitchChainMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSwitchChain */
export function useSwitchChain<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSwitchChainParameters<config, context> = {},
): UseSwitchChainReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = switchChainMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSwitchChainReturnType<config, context>
  return {
    ...result,
    chains: useChains({ config }) as unknown as config['chains'],
    switchChain: mutate as Return['switchChain'],
    switchChainAsync: mutateAsync as Return['switchChainAsync'],
  }
}
