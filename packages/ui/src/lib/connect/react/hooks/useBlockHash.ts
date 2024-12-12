'use client'

import { useQueryClient } from '@tanstack/react-query'
import type {
  Config,
  GetBlockHashErrorType,
  ResolvedRegister,
} from '@/lib/connect/core/exports'
import type {
  Compute,
  UnionCompute,
  UnionStrictOmit,
} from '@/lib/connect/core/exports/internal'
import {
  type GetBlockHashData,
  type GetBlockHashOptions,
  type GetBlockHashQueryFnData,
  type GetBlockHashQueryKey,
  getBlockHashQueryOptions,
} from '@/lib/connect/core/exports/query'

import type { ConfigParameter, QueryParameter } from '../types/properties'
import { useQuery, type UseQueryReturnType } from '../utils/query'
import { useNetworkId } from './useNetworkId'
import { useConfig } from './useConfig'
import {
  useWatchBlockHash,
  type UseWatchBlockHashParameters,
} from './useWatchBlockHash'

export type UseBlockHashParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockHashData,
> = Compute<
  GetBlockHashOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetBlockHashQueryFnData,
      GetBlockHashErrorType,
      selectData,
      GetBlockHashQueryKey<config, networkId>
    > & {
      watch?:
        | boolean
        | UnionCompute<
            UnionStrictOmit<
              UseWatchBlockHashParameters<config, networkId>,
              'networkId' | 'config' | 'onBlockHash' | 'onError'
            >
          >
        | undefined
    }
>

export type UseBlockHashReturnType<selectData = GetBlockHashData> =
  UseQueryReturnType<selectData, GetBlockHashErrorType>

/** https://wagmi.sh/react/api/hooks/useBlockHash */
export function useBlockHash<
  config extends Config = ResolvedRegister['config'],
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockHashData,
>(
  parameters: UseBlockHashParameters<config, networkId, selectData> = {},
): UseBlockHashReturnType<selectData> {
  const { query = {}, watch } = parameters

  const config = useConfig(parameters)
  const queryClient = useQueryClient()
  const configNetworkId = useNetworkId({ config })
  const networkId = parameters.networkId ?? configNetworkId

  const options = getBlockHashQueryOptions(config, {
    ...parameters,
    networkId,
  })

  useWatchBlockHash({
    ...({
      config: parameters.config,
      networkId: parameters.networkId,
      ...(typeof watch === 'object' ? watch : {}),
    } as UseWatchBlockHashParameters),
    enabled: Boolean(
      (query.enabled ?? true) &&
        (typeof watch === 'object' ? watch.enabled : watch),
    ),
    onBlockHash(blockNumber) {
      queryClient.setQueryData(options.queryKey, blockNumber)
    },
  })

  return useQuery({ ...query, ...options })
}
