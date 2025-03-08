import type { SelectChains } from '@/lib/connect/core/types/chain'
import type { QueryOptions } from '@tanstack/query-core'
import type { GetChainParameter } from 'vimina'
import {
  type FetchAccountErrorType,
  type FetchAccountParameters,
  type FetchAccountReturnType,
  fetchAccount,
} from '../actions/fetchAccount'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, PartialBy } from '../types/utils'
import { filterQueryOptions } from './utils'

export type FetchAccountOptions<config extends Config> = Compute<
  PartialBy<
    FetchAccountParameters<config, config['chains'][number]['id']>,
    | 'address'
    | keyof GetChainParameter<
        SelectChains<config, config['chains'][number]['id']>[number],
        SelectChains<config, config['chains'][number]['id']>[number]
      >
  > &
    ScopeKeyParameter
>

export function fetchAccountQueryOptions<config extends Config>(
  config: config,
  options: FetchAccountOptions<config> = {} as FetchAccountOptions<config>,
) {
  return {
    async queryFn({ queryKey }) {
      const { address, scopeKey: _, ...parameters } = queryKey[1]
      if (!address) throw new Error('address is required')
      const account = await fetchAccount(config, {
        ...(parameters as unknown as FetchAccountParameters<
          config,
          config['chains'][number]['id']
        >),
        address,
      })
      return account ?? null
    },
    queryKey: fetchAccountQueryKey(options),
  } as const satisfies QueryOptions<
    FetchAccountQueryFnData,
    FetchAccountErrorType,
    FetchAccountData,
    FetchAccountQueryKey<config>
  >
}

export type FetchAccountQueryFnData = Compute<FetchAccountReturnType>

export type FetchAccountData = FetchAccountQueryFnData

export function fetchAccountQueryKey<config extends Config>(
  options: FetchAccountOptions<config> = {} as FetchAccountOptions<config>,
) {
  return ['fetchAccount', filterQueryOptions(options)] as const
}

export type FetchAccountQueryKey<config extends Config> = ReturnType<
  typeof fetchAccountQueryKey<config>
>
