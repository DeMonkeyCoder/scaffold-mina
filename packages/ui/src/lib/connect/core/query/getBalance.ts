import type { QueryOptions } from '@tanstack/query-core'

import {
  getBalance,
  type GetBalanceErrorType,
  type GetBalanceParameters,
  type GetBalanceReturnType,
} from '../actions/getBalance'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, PartialBy } from '../types/utils'
import { filterQueryOptions } from './utils'

export type GetBalanceOptions<config extends Config> = Compute<
  PartialBy<GetBalanceParameters<config>, 'address'> & ScopeKeyParameter
>

export function getBalanceQueryOptions<config extends Config>(
  config: config,
  options: GetBalanceOptions<config> = {},
) {
  return {
    async queryFn({ queryKey }) {
      const { address, scopeKey: _, ...parameters } = queryKey[1]
      if (!address) throw new Error('address is required')
      const balance = await getBalance(config, {
        ...(parameters as GetBalanceParameters),
        address,
      })
      return balance ?? null
    },
    queryKey: getBalanceQueryKey(options),
  } as const satisfies QueryOptions<
    GetBalanceQueryFnData,
    GetBalanceErrorType,
    GetBalanceData,
    GetBalanceQueryKey<config>
  >
}

export type GetBalanceQueryFnData = Compute<GetBalanceReturnType>

export type GetBalanceData = GetBalanceQueryFnData

export function getBalanceQueryKey<config extends Config>(
  options: GetBalanceOptions<config> = {},
) {
  return ['balance', filterQueryOptions(options)] as const
}

export type GetBalanceQueryKey<config extends Config> = ReturnType<
  typeof getBalanceQueryKey<config>
>
