'use client'

import type {
  Config,
  GetBalanceErrorType,
  ResolvedRegister,
} from '@/lib/connect/core/exports'
import type { Compute } from '@/lib/connect/core/exports/internal'
import type { GetBalanceQueryFnData } from '@/lib/connect/core/exports/query'
import {
  type GetBalanceData,
  type GetBalanceOptions,
  type GetBalanceQueryKey,
  getBalanceQueryOptions,
} from '@/lib/connect/core/exports/query'

import { useInvalidateOnBlock } from '@/lib/connect/react/hooks/useInvalidateOnBlock'
import type { ConfigParameter, QueryParameter } from '../types/properties'
import { type UseQueryReturnType, useQuery } from '../utils/query'
import { useConfig } from './useConfig'
import { useNetworkId } from './useNetworkId'

export type UseBalanceParameters<
  config extends Config = Config,
  selectData = GetBalanceData,
> = Compute<
  GetBalanceOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetBalanceQueryFnData,
      GetBalanceErrorType,
      selectData,
      GetBalanceQueryKey<config>
    > & {
      watch?: boolean
    }
>

export type UseBalanceReturnType<selectData = GetBalanceData> =
  UseQueryReturnType<selectData, GetBalanceErrorType>

/** https://wagmi.sh/react/api/hooks/useBalance */
export function useBalance<
  config extends Config = ResolvedRegister['config'],
  selectData = GetBalanceData,
>(
  parameters: UseBalanceParameters<config, selectData> = {},
): UseBalanceReturnType<selectData> {
  const { address, watch, query = {} } = parameters

  const config = useConfig(parameters)
  const networkId = useNetworkId({ config })

  const options = getBalanceQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  })
  const enabled = Boolean(address && (query.enabled ?? true))

  const balanceQuery = useQuery({ ...query, ...options, enabled })

  useInvalidateOnBlock({
    networkId,
    enabled: Boolean(enabled && watch),
    queryKey: balanceQuery.queryKey,
  })

  return balanceQuery
}
