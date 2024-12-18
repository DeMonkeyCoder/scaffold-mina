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
import { useNetworkId } from './useNetworkId'

export type UseFetchAccountParameters<
  config extends Config = Config,
  selectData = FetchAccountData,
> = Compute<
  FetchAccountOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      FetchAccountQueryFnData,
      FetchAccountErrorType,
      selectData,
      FetchAccountQueryKey<config>
    >
>

export type UseFetchAccountReturnType<selectData = FetchAccountData> =
  UseQueryReturnType<selectData, FetchAccountErrorType>

/** https://wagmi.sh/react/api/hooks/useFetchAccount */
export function useFetchAccount<
  config extends Config = ResolvedRegister['config'],
  selectData = FetchAccountData,
>(
  parameters: UseFetchAccountParameters<config, selectData> = {},
): UseFetchAccountReturnType<selectData> {
  const { address, query = {} } = parameters

  const config = useConfig(parameters)
  const networkId = useNetworkId({ config })

  const options = fetchAccountQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  })
  const enabled = Boolean(address && (query.enabled ?? true))

  return useQuery({ ...query, ...options, enabled })
}
