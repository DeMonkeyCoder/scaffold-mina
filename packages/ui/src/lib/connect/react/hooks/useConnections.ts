'use client'

import {
  type GetConnectionsReturnType,
  getConnections,
  watchConnections,
} from '@/lib/connect/core/exports'
import { useSyncExternalStore } from 'react'

import type { ConfigParameter } from '../types/properties'
import { useConfig } from './useConfig'

export type UseConnectionsParameters = ConfigParameter

export type UseConnectionsReturnType = GetConnectionsReturnType

/** https://wagmi.sh/react/api/hooks/useConnections */
export function useConnections(
  parameters: UseConnectionsParameters = {},
): UseConnectionsReturnType {
  const config = useConfig(parameters)

  return useSyncExternalStore(
    (onChange) => watchConnections(config, { onChange }),
    () => getConnections(config),
    () => getConnections(config),
  )
}
