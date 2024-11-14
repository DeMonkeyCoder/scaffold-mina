import type { QueryOptions } from '@tanstack/query-core'

import {
  type EstimateMaxPriorityFeePerGasErrorType,
  type EstimateMaxPriorityFeePerGasParameters,
  type EstimateMaxPriorityFeePerGasReturnType,
  estimateMaxPriorityFeePerGas,
} from '../actions/estimateMaxPriorityFeePerGas'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, ExactPartial } from '../types/utils'
import { filterQueryOptions } from './utils'

export type EstimateMaxPriorityFeePerGasOptions<config extends Config> =
  Compute<
    ExactPartial<EstimateMaxPriorityFeePerGasParameters<config>> &
      ScopeKeyParameter
  >

export function estimateMaxPriorityFeePerGasQueryOptions<config extends Config>(
  config: config,
  options: EstimateMaxPriorityFeePerGasOptions<config> = {},
) {
  return {
    async queryFn({ queryKey }) {
      const { scopeKey: _, ...parameters } = queryKey[1]
      return estimateMaxPriorityFeePerGas(config, parameters)
    },
    queryKey: estimateMaxPriorityFeePerGasQueryKey(options),
  } as const satisfies QueryOptions<
    EstimateMaxPriorityFeePerGasQueryFnData,
    EstimateMaxPriorityFeePerGasErrorType,
    EstimateMaxPriorityFeePerGasData,
    EstimateMaxPriorityFeePerGasQueryKey<config>
  >
}

export type EstimateMaxPriorityFeePerGasQueryFnData =
  EstimateMaxPriorityFeePerGasReturnType

export type EstimateMaxPriorityFeePerGasData =
  EstimateMaxPriorityFeePerGasQueryFnData

export function estimateMaxPriorityFeePerGasQueryKey<config extends Config>(
  options: EstimateMaxPriorityFeePerGasOptions<config> = {},
) {
  return ['estimateMaxPriorityFeePerGas', filterQueryOptions(options)] as const
}

export type EstimateMaxPriorityFeePerGasQueryKey<config extends Config> =
  ReturnType<typeof estimateMaxPriorityFeePerGasQueryKey<config>>
