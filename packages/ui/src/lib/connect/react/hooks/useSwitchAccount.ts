'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  Connector,
  ResolvedRegister,
  SwitchAccountErrorType,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type SwitchAccountData,
  type SwitchAccountMutate,
  type SwitchAccountMutateAsync,
  type SwitchAccountVariables,
  switchAccountMutationOptions,
} from '@/lib/connect/core/exports/query'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useConfig } from './useConfig'
import { useConnections } from './useConnections'

export type UseSwitchAccountParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SwitchAccountData<config>,
          SwitchAccountErrorType,
          SwitchAccountVariables,
          context
        >
      | undefined
  }
>

export type UseSwitchAccountReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SwitchAccountData<config>,
    SwitchAccountErrorType,
    SwitchAccountVariables,
    context
  > & {
    connectors: readonly Connector[]
    switchAccount: SwitchAccountMutate<config, context>
    switchAccountAsync: SwitchAccountMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSwitchAccount */
export function useSwitchAccount<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSwitchAccountParameters<config, context> = {},
): UseSwitchAccountReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = switchAccountMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  return {
    ...result,
    connectors: useConnections({ config }).map(
      (connection) => connection.connector,
    ),
    switchAccount: mutate,
    switchAccountAsync: mutateAsync,
  }
}
