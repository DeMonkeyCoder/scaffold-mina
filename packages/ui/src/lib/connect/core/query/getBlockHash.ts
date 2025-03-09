import type { QueryOptions } from '@tanstack/query-core'

import {
  type GetBlockHashErrorType,
  type GetBlockHashParameters,
  type GetBlockHashReturnType,
  getBlockHash,
} from '../actions/getBlockHash'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, ExactPartial } from '../types/utils'
import { filterQueryOptions } from './utils'

export type GetBlockHashOptions<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = Compute<
  ExactPartial<GetBlockHashParameters<config, networkId>> & ScopeKeyParameter
>

export function getBlockHashQueryOptions<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(config: config, options: GetBlockHashOptions<config, networkId> = {}) {
  return {
    gcTime: 0,
    async queryFn({ queryKey }) {
      const { scopeKey: _, ...parameters } = queryKey[1]
      const blockHash = await getBlockHash(config, parameters)
      return blockHash ?? null
    },
    queryKey: getBlockHashQueryKey(options),
  } as const satisfies QueryOptions<
    GetBlockHashQueryFnData,
    GetBlockHashErrorType,
    GetBlockHashData,
    GetBlockHashQueryKey<config, networkId>
  >
}

export type GetBlockHashQueryFnData = GetBlockHashReturnType

export type GetBlockHashData = GetBlockHashQueryFnData

export function getBlockHashQueryKey<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(options: GetBlockHashOptions<config, networkId> = {}) {
  return ['blockNumber', filterQueryOptions(options)] as const
}

export type GetBlockHashQueryKey<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = ReturnType<typeof getBlockHashQueryKey<config, networkId>>
