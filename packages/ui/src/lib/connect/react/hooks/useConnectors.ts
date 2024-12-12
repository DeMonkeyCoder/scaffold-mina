'use client'

import {
  type GetConnectorsReturnType,
  getConnectors,
  watchConnectors,
} from '@/lib/connect/core/exports'
import { useSyncExternalStore } from 'react'

import type { ConfigParameter } from '../types/properties'
import { useConfig } from './useConfig'

export type UseConnectorsParameters = ConfigParameter

export type UseConnectorsReturnType = GetConnectorsReturnType

/** https://wagmi.sh/react/api/hooks/useConnectors */
export function useConnectors(
  parameters: UseConnectorsParameters = {},
): UseConnectorsReturnType {
  const config = useConfig(parameters)

  return useSyncExternalStore(
    (onChange) => watchConnectors(config, { onChange }),
    () => getConnectors(config),
    () => getConnectors(config),
  )
}
