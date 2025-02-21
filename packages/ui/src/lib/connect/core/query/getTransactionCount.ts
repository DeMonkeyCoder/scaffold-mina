import type { QueryOptions } from '@tanstack/query-core'

import {
  getTransactionCount,
  type GetTransactionCountErrorType,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
} from '../actions/getTransactionCount'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, PartialBy } from '../types/utils'
import { filterQueryOptions } from './utils'

export type GetTransactionCountOptions<config extends Config> = Compute<
  PartialBy<GetTransactionCountParameters<config>, 'address'> &
    ScopeKeyParameter
>

export function getTransactionCountQueryOptions<config extends Config>(
  config: config,
  options: GetTransactionCountOptions<config> = {},
) {
  return {
    async queryFn({ queryKey }) {
      const { address, scopeKey: _, ...parameters } = queryKey[1]
      if (!address) throw new Error('address is required')
      const transactionCount = await getTransactionCount(config, {
        ...(parameters as GetTransactionCountParameters),
        address,
      })
      return transactionCount ?? null
    },
    queryKey: getTransactionCountQueryKey(options),
  } as const satisfies QueryOptions<
    GetTransactionCountQueryFnData,
    GetTransactionCountErrorType,
    GetTransactionCountData,
    GetTransactionCountQueryKey<config>
  >
}

export type GetTransactionCountQueryFnData =
  Compute<GetTransactionCountReturnType>

export type GetTransactionCountData = GetTransactionCountQueryFnData

export function getTransactionCountQueryKey<config extends Config>(
  options: GetTransactionCountOptions<config> = {},
) {
  return ['transactionCount', filterQueryOptions(options)] as const
}

export type GetTransactionCountQueryKey<config extends Config> = ReturnType<
  typeof getTransactionCountQueryKey<config>
>
