import type { CallParameters } from '../../actions/public/call'
import type { BaseError } from '../../errors/base'
import {
  CallExecutionError,
  type CallExecutionErrorType,
} from '../../errors/contract'
import { UnknownNodeError } from '../../errors/node'
import type { ErrorType } from '../../errors/utils'
import type { Chain } from '../../types/chain'

import {
  type GetNodeErrorParameters,
  type GetNodeErrorReturnType,
  getNodeError,
} from './getNodeError'

export type GetCallErrorReturnType<cause = ErrorType> = Omit<
  CallExecutionErrorType,
  'cause'
> & {
  cause: cause | GetNodeErrorReturnType
}

export function getCallError<err extends ErrorType<string>>(
  err: err,
  {
    docsPath,
    ...args
  }: CallParameters & {
    chain?: Chain | undefined
    docsPath?: string | undefined
  },
): GetCallErrorReturnType<err> {
  const cause = (() => {
    const cause = getNodeError(
      err as {} as BaseError,
      args as GetNodeErrorParameters,
    )
    if (cause instanceof UnknownNodeError) return err as {} as BaseError
    return cause
  })()
  return new CallExecutionError(cause, {
    docsPath,
    ...args,
  }) as GetCallErrorReturnType<err>
}
