'use client'

// Almost identical implementation to `useConnectorClient` (except for return type)
// Should update both in tandem

import { useQueryClient } from '@tanstack/react-query'
import type {
  Config,
  GetWalletClientErrorType,
  ResolvedRegister,
} from '@/lib/connect/core/exports'
import type { Compute, Omit } from '@/lib/connect/core/exports/internal'
import {
  type GetWalletClientData,
  type GetWalletClientOptions,
  type GetWalletClientQueryFnData,
  type GetWalletClientQueryKey,
  getWalletClientQueryOptions,
} from '@/lib/connect/core/exports/query'
import { useEffect, useRef } from 'react'

import type { ConfigParameter } from '../types/properties'
import {
  type UseQueryParameters,
  type UseQueryReturnType,
  useQuery,
} from '../utils/query'
import { useAccount } from './useAccount'
import { useNetworkId } from './useNetworkId'
import { useConfig } from './useConfig'

export type UseWalletClientParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, networkId>,
> = Compute<
  GetWalletClientOptions<config, networkId> &
    ConfigParameter<config> & {
      query?:
        | Compute<
            Omit<
              UseQueryParameters<
                GetWalletClientQueryFnData<config, networkId>,
                GetWalletClientErrorType,
                selectData,
                GetWalletClientQueryKey<config, networkId>
              >,
              'gcTime' | 'staleTime'
            >
          >
        | undefined
    }
>

export type UseWalletClientReturnType<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, networkId>,
> = UseQueryReturnType<selectData, GetWalletClientErrorType>

/** https://wagmi.sh/react/api/hooks/useWalletClient */
export function useWalletClient<
  config extends Config = ResolvedRegister['config'],
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, networkId>,
>(
  parameters: UseWalletClientParameters<config, networkId, selectData> = {},
): UseWalletClientReturnType<config, networkId, selectData> {
  const { query = {}, ...rest } = parameters

  const config = useConfig(rest)
  const queryClient = useQueryClient()
  const { address, connector, status } = useAccount({ config })
  const networkId = useNetworkId({ config })

  const { queryKey, ...options } = getWalletClientQueryOptions<
    config,
    networkId
  >(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
    connector: parameters.connector ?? connector,
  })
  const enabled = Boolean(status !== 'disconnected' && (query.enabled ?? true))

  const addressRef = useRef(address)
  // biome-ignore lint/correctness/useExhaustiveDependencies: `queryKey` not required
  useEffect(() => {
    const previousAddress = addressRef.current
    if (!address && previousAddress) {
      // remove when account is disconnected
      queryClient.removeQueries({ queryKey })
      addressRef.current = undefined
    } else if (address !== previousAddress) {
      // invalidate when address changes
      queryClient.invalidateQueries({ queryKey })
      addressRef.current = address
    }
  }, [address, queryClient])

  return useQuery({
    ...query,
    ...options,
    queryKey,
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
  } as any) as UseWalletClientReturnType<config, networkId, selectData>
}
