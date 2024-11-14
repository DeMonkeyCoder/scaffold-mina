import type { QueryOptions } from '@tanstack/query-core'

import type { Config } from '../../createConfig'
import { ConnectorNotConnectedError } from '../../errors/config'
import { filterQueryOptions } from '../../query/utils'
import type { ScopeKeyParameter } from '../../types/properties'
import type { Compute } from '../../types/utils'
import {
  type GetCallsStatusErrorType,
  type GetCallsStatusParameters,
  type GetCallsStatusReturnType,
  getCallsStatus,
} from '../actions/getCallsStatus'

export type GetCallsStatusOptions = Compute<
  GetCallsStatusParameters & ScopeKeyParameter
>

export function getCallsStatusQueryOptions<config extends Config>(
  config: config,
  options: GetCallsStatusOptions,
) {
  return {
    async queryFn({ queryKey }) {
      const { scopeKey: _, ...parameters } = queryKey[1]
      const status = await getCallsStatus(config, parameters)
      return status
    },
    queryKey: getCallsStatusQueryKey(options),
    retry(failureCount, error) {
      if (error instanceof ConnectorNotConnectedError) return false
      return failureCount < 3
    },
  } as const satisfies QueryOptions<
    GetCallsStatusQueryFnData,
    GetCallsStatusErrorType,
    GetCallsStatusData,
    GetCallsStatusQueryKey
  >
}

export type GetCallsStatusQueryFnData = GetCallsStatusReturnType

export type GetCallsStatusData = GetCallsStatusQueryFnData

export function getCallsStatusQueryKey(options: GetCallsStatusOptions) {
  return ['callsStatus', filterQueryOptions(options)] as const
}

export type GetCallsStatusQueryKey = ReturnType<typeof getCallsStatusQueryKey>
