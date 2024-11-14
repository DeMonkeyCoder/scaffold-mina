import type { QueryOptions } from '@tanstack/query-core'

import {
  type WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptParameters,
  type WaitForTransactionReceiptReturnType,
  waitForTransactionReceipt,
} from '../actions/waitForTransactionReceipt'
import type { Config } from '../createConfig'
import type { ScopeKeyParameter } from '../types/properties'
import type { Compute, ExactPartial } from '../types/utils'
import { filterQueryOptions } from './utils'

export type WaitForTransactionReceiptOptions<
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = Compute<
  ExactPartial<WaitForTransactionReceiptParameters<config, chainId>> &
    ScopeKeyParameter
>

export function waitForTransactionReceiptQueryOptions<
  config extends Config,
  chainId extends config['chains'][number]['id'],
>(
  config: config,
  options: WaitForTransactionReceiptOptions<config, chainId> = {},
) {
  return {
    async queryFn({ queryKey }) {
      const { hash, ...parameters } = queryKey[1]
      if (!hash) throw new Error('hash is required')
      return waitForTransactionReceipt(config, {
        ...parameters,
        onReplaced: options.onReplaced,
        hash,
      }) as unknown as Promise<
        WaitForTransactionReceiptReturnType<config, chainId>
      >
    },
    queryKey: waitForTransactionReceiptQueryKey(options),
  } as const satisfies QueryOptions<
    WaitForTransactionReceiptQueryFnData<config, chainId>,
    WaitForTransactionReceiptErrorType,
    WaitForTransactionReceiptData<config, chainId>,
    WaitForTransactionReceiptQueryKey<config, chainId>
  >
}

export type WaitForTransactionReceiptQueryFnData<
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = WaitForTransactionReceiptReturnType<config, chainId>

export type WaitForTransactionReceiptData<
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = WaitForTransactionReceiptQueryFnData<config, chainId>

export function waitForTransactionReceiptQueryKey<
  config extends Config,
  chainId extends config['chains'][number]['id'],
>(options: WaitForTransactionReceiptOptions<config, chainId> = {}) {
  const { onReplaced: _, ...rest } = options
  return ['waitForTransactionReceipt', filterQueryOptions(rest)] as const
}

export type WaitForTransactionReceiptQueryKey<
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = ReturnType<typeof waitForTransactionReceiptQueryKey<config, chainId>>
