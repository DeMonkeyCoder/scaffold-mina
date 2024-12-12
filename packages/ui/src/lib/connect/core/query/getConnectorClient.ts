import type { QueryOptions } from '@tanstack/query-core'

import {
  type GetConnectorClientErrorType,
  type GetConnectorClientParameters,
  type GetConnectorClientReturnType,
  getConnectorClient,
} from '../actions/getConnectorClient'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, ExactPartial } from '../types/utils'
import { filterQueryOptions } from './utils'

export type GetConnectorClientOptions<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = Compute<
  ExactPartial<GetConnectorClientParameters<config, networkId>> &
    ScopeKeyParameter
>

export function getConnectorClientQueryOptions<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(config: config, options: GetConnectorClientOptions<config, networkId> = {}) {
  return {
    gcTime: 0,
    async queryFn({ queryKey }) {
      const { connector } = options
      const { connectorUid: _, scopeKey: _s, ...parameters } = queryKey[1]
      return getConnectorClient(config, {
        ...parameters,
        connector,
      }) as unknown as Promise<GetConnectorClientReturnType<config, networkId>>
    },
    queryKey: getConnectorClientQueryKey(options),
  } as const satisfies QueryOptions<
    GetConnectorClientQueryFnData<config, networkId>,
    GetConnectorClientErrorType,
    GetConnectorClientData<config, networkId>,
    GetConnectorClientQueryKey<config, networkId>
  >
}

export type GetConnectorClientQueryFnData<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = GetConnectorClientReturnType<config, networkId>

export type GetConnectorClientData<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = GetConnectorClientQueryFnData<config, networkId>

export function getConnectorClientQueryKey<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(options: GetConnectorClientOptions<config, networkId> = {}) {
  const { connector, ...parameters } = options
  return [
    'connectorClient',
    { ...filterQueryOptions(parameters), connectorUid: connector?.uid },
  ] as const
}

export type GetConnectorClientQueryKey<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = ReturnType<typeof getConnectorClientQueryKey<config, networkId>>
