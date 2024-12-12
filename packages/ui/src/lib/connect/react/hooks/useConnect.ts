'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  ConnectErrorType,
  ResolvedRegister,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type ConnectData,
  type ConnectMutate,
  type ConnectMutateAsync,
  type ConnectVariables,
  connectMutationOptions,
} from '@/lib/connect/core/exports/query'
import { useEffect } from 'react'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useConfig } from './useConfig'
import { type UseConnectorsReturnType, useConnectors } from './useConnectors'

export type UseConnectParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          ConnectData<config>,
          ConnectErrorType,
          ConnectVariables<config>,
          context
        >
      | undefined
  }
>

export type UseConnectReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    ConnectData<config>,
    ConnectErrorType,
    ConnectVariables<config>,
    context
  > & {
    connect: ConnectMutate<config, context>
    connectAsync: ConnectMutateAsync<config, context>
    connectors: Compute<UseConnectorsReturnType>
  }
>

/** https://wagmi.sh/react/api/hooks/useConnect */
export function useConnect<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseConnectParameters<config, context> = {},
): UseConnectReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = connectMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  // Reset mutation back to an idle state when the connector disconnects.
  useEffect(() => {
    return config.subscribe(
      ({ status }) => status,
      (status, previousStatus) => {
        if (previousStatus === 'connected' && status === 'disconnected')
          result.reset()
      },
    )
  }, [config, result.reset])

  return {
    ...result,
    connect: mutate,
    connectAsync: mutateAsync,
    connectors: useConnectors({ config }),
  }
}
