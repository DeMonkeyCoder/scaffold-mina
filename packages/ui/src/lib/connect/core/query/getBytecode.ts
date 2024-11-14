import type { QueryOptions } from '@tanstack/query-core'

import {
  type GetBytecodeErrorType,
  type GetBytecodeParameters,
  type GetBytecodeReturnType,
  getBytecode,
} from '../actions/getBytecode'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, ExactPartial } from '../types/utils'
import { filterQueryOptions } from './utils'

export type GetBytecodeOptions<config extends Config> = Compute<
  ExactPartial<GetBytecodeParameters<config>> & ScopeKeyParameter
>

export function getBytecodeQueryOptions<config extends Config>(
  config: config,
  options: GetBytecodeOptions<config> = {},
) {
  return {
    async queryFn({ queryKey }) {
      const { address, scopeKey: _, ...parameters } = queryKey[1]
      if (!address) throw new Error('address is required')
      const bytecode = await getBytecode(config, { ...parameters, address })
      return (bytecode ?? null) as any
    },
    queryKey: getBytecodeQueryKey(options),
  } as const satisfies QueryOptions<
    GetBytecodeQueryFnData,
    GetBytecodeErrorType,
    GetBytecodeData,
    GetBytecodeQueryKey<config>
  >
}
export type GetBytecodeQueryFnData = GetBytecodeReturnType

export type GetBytecodeData = GetBytecodeQueryFnData

export function getBytecodeQueryKey<config extends Config>(
  options: GetBytecodeOptions<config>,
) {
  return ['getBytecode', filterQueryOptions(options)] as const
}

export type GetBytecodeQueryKey<config extends Config> = ReturnType<
  typeof getBytecodeQueryKey<config>
>
