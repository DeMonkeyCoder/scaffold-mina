'use client'

import type {
  Config,
  FetchAccountErrorType,
  ResolvedRegister,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import type { FetchAccountQueryFnData } from '@/lib/connect/core/exports/query'
import {
  type FetchAccountData,
  type FetchAccountOptions,
  type FetchAccountQueryKey,
  fetchAccountQueryOptions,
} from '@/lib/connect/core/exports/query'

import type { ConfigParameter, QueryParameter } from '../types/properties'
import { type UseQueryReturnType, useQuery } from '../utils/query'
import { useConfig } from './useConfig'
import { useInvalidateOnBlock } from './useInvalidateOnBlock'
import { useNetworkId } from './useNetworkId'

export type UseFetchAccountParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = FetchAccountData,
> = Compute<
  FetchAccountOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      FetchAccountQueryFnData,
      FetchAccountErrorType,
      selectData,
      FetchAccountQueryKey<config, networkId>
    > & {
      watch?: boolean
    }
>

export type UseFetchAccountReturnType<selectData = FetchAccountData> =
  UseQueryReturnType<selectData, FetchAccountErrorType>

/** https://wagmi.sh/react/api/hooks/useFetchAccount */
export function useFetchAccount<
  config extends Config = ResolvedRegister['config'],
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = FetchAccountData,
>(
  parameters: UseFetchAccountParameters<
    config,
    networkId,
    selectData
  > = {} as UseFetchAccountParameters<config, networkId, selectData>,
): UseFetchAccountReturnType<selectData> {
  const { address, watch, query = {} } = parameters

  const config = useConfig(parameters)
  const networkId = useNetworkId({ config })

  const options = fetchAccountQueryOptions(
    config as config,
    {
      ...parameters,
      networkId: parameters.chain?.id ?? networkId,
    } as FetchAccountOptions<config, networkId>,
  )
  const enabled = Boolean(address && (query.enabled ?? true))

  const fetchAccountQuery = useQuery({ ...query, ...options, enabled })

  useInvalidateOnBlock({
    networkId,
    enabled: Boolean(enabled && watch),
    queryKey: fetchAccountQuery.queryKey,
  })

  return fetchAccountQuery
}
