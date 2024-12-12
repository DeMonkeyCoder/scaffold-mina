'use client'

import { useMutation } from '@tanstack/react-query'
import type { Connector, ReconnectErrorType } from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import {
  type ReconnectData,
  type ReconnectMutate,
  type ReconnectMutateAsync,
  type ReconnectVariables,
  reconnectMutationOptions,
} from '@/lib/connect/core/exports/query'

import type { ConfigParameter } from '../types/properties'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query'
import { useConfig } from './useConfig'

export type UseReconnectParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?:
      | UseMutationParameters<
          ReconnectData,
          ReconnectErrorType,
          ReconnectVariables,
          context
        >
      | undefined
  }
>

export type UseReconnectReturnType<context = unknown> = Compute<
  UseMutationReturnType<
    ReconnectData,
    ReconnectErrorType,
    ReconnectVariables,
    context
  > & {
    connectors: readonly Connector[]
    reconnect: ReconnectMutate<context>
    reconnectAsync: ReconnectMutateAsync<context>
  }
>

/** https://wagmi.sh/react/api/hooks/useReconnect */
export function useReconnect<context = unknown>(
  parameters: UseReconnectParameters<context> = {},
): UseReconnectReturnType<context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = reconnectMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  return {
    ...result,
    connectors: config.connectors,
    reconnect: mutate,
    reconnectAsync: mutateAsync,
  }
}
