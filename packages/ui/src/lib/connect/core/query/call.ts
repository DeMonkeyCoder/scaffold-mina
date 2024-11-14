import type { QueryOptions } from '@tanstack/query-core'

import {
  type CallErrorType,
  type CallParameters,
  type CallReturnType,
  call,
} from '../actions/call'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, ExactPartial } from '../types/utils'
import { filterQueryOptions } from './utils'

export type CallOptions<config extends Config> = Compute<
  ExactPartial<CallParameters<config>> & ScopeKeyParameter
>

export function callQueryOptions<config extends Config>(
  config: config,
  options: CallOptions<config> = {},
) {
  return {
    async queryFn({ queryKey }) {
      const { scopeKey: _, ...parameters } = queryKey[1]
      const data = await call(config, {
        ...parameters,
      } as CallParameters)
      return data ?? null
    },
    queryKey: callQueryKey(options),
  } as const satisfies QueryOptions<
    CallQueryFnData,
    CallErrorType,
    CallData,
    CallQueryKey<config>
  >
}

export type CallQueryFnData = CallReturnType

export type CallData = CallQueryFnData

export function callQueryKey<config extends Config>(
  options: CallOptions<config>,
) {
  return ['call', filterQueryOptions(options)] as const
}

export type CallQueryKey<config extends Config> = ReturnType<
  typeof callQueryKey<config>
>
