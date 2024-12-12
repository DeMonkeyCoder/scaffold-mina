'use client'

import {
  type Config,
  type GetChainsReturnType,
  type ResolvedRegister,
  getChains,
} from '@/lib/connect/core/exports'
import { watchChains } from '@/lib/connect/core/exports/internal'
import { useSyncExternalStore } from 'react'

import type { ConfigParameter } from '../types/properties'
import { useConfig } from './useConfig'

export type UseChainsParameters<config extends Config = Config> =
  ConfigParameter<config>

export type UseChainsReturnType<config extends Config = Config> =
  GetChainsReturnType<config>

/** https://wagmi.sh/react/api/hooks/useChains */
export function useChains<config extends Config = ResolvedRegister['config']>(
  parameters: UseChainsParameters<config> = {},
): UseChainsReturnType<config> {
  const config = useConfig(parameters)

  return useSyncExternalStore(
    (onChange) => watchChains(config, { onChange }),
    () => getChains(config),
    () => getChains(config),
  )
}
