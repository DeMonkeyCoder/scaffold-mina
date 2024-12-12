import type { QueryOptions } from '@tanstack/query-core'

import {
  type GetWalletClientErrorType,
  type GetWalletClientParameters,
  type GetWalletClientReturnType,
  getWalletClient,
} from '../actions/getWalletClient'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, ExactPartial } from '../types/utils'
import { filterQueryOptions } from './utils'

export type GetWalletClientOptions<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = Compute<
  ExactPartial<GetWalletClientParameters<config, networkId>> & ScopeKeyParameter
>

export function getWalletClientQueryOptions<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(config: config, options: GetWalletClientOptions<config, networkId> = {}) {
  return {
    gcTime: 0,
    async queryFn({ queryKey }) {
      const { connector } = options
      const { connectorUid: _, scopeKey: _s, ...parameters } = queryKey[1]
      return getWalletClient(config, { ...parameters, connector })
    },
    queryKey: getWalletClientQueryKey(options),
  } as const satisfies QueryOptions<
    GetWalletClientQueryFnData<config, networkId>,
    GetWalletClientErrorType,
    GetWalletClientData<config, networkId>,
    GetWalletClientQueryKey<config, networkId>
  >
}

export type GetWalletClientQueryFnData<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = GetWalletClientReturnType<config, networkId>

export type GetWalletClientData<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = GetWalletClientQueryFnData<config, networkId>

export function getWalletClientQueryKey<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(options: GetWalletClientOptions<config, networkId> = {}) {
  const { connector, ...parameters } = options
  return [
    'walletClient',
    { ...filterQueryOptions(parameters), connectorUid: connector?.uid },
  ] as const
}

export type GetWalletClientQueryKey<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = ReturnType<typeof getWalletClientQueryKey<config, networkId>>
