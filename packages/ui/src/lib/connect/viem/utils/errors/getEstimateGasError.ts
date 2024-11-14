import type { Account } from '../../accounts/types'
import type { EstimateGasParameters } from '../../actions/public/estimateGas'
import type { BaseError } from '../../errors/base'
import {
  EstimateGasExecutionError,
  type EstimateGasExecutionErrorType,
} from '../../errors/estimateGas'
import { UnknownNodeError } from '../../errors/node'
import type { ErrorType } from '../../errors/utils'
import type { Chain } from '../../types/chain'

import {
  type GetNodeErrorParameters,
  type GetNodeErrorReturnType,
  getNodeError,
} from './getNodeError'

export type GetEstimateGasErrorReturnType<cause = ErrorType> = Omit<
  EstimateGasExecutionErrorType,
  'cause'
> & { cause: cause | GetNodeErrorReturnType }

export function getEstimateGasError<err extends ErrorType<string>>(
  err: err,
  {
    docsPath,
    ...args
  }: Omit<EstimateGasParameters, 'account'> & {
    account?: Account | undefined
    chain?: Chain | undefined
    docsPath?: string | undefined
  },
): GetEstimateGasErrorReturnType<err> {
  const cause = (() => {
    const cause = getNodeError(
      err as {} as BaseError,
      args as GetNodeErrorParameters,
    )
    if (cause instanceof UnknownNodeError) return err as {} as BaseError
    return cause
  })()
  return new EstimateGasExecutionError(cause, {
    docsPath,
    ...args,
  }) as GetEstimateGasErrorReturnType<err>
}
