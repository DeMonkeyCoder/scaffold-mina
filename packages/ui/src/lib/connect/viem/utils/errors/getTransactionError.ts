import type { Account } from '../../accounts/types'
import type { SendTransactionParameters } from '../../actions/wallet/sendTransaction'
import type { BaseError } from '../../errors/base'
import { UnknownNodeError } from '../../errors/node'
import {
  TransactionExecutionError,
  type TransactionExecutionErrorType,
} from '../../errors/transaction'
import type { ErrorType } from '../../errors/utils'
import type { Chain } from '../../types/chain'

import {
  type GetNodeErrorParameters,
  type GetNodeErrorReturnType,
  getNodeError,
} from './getNodeError'

export type GetTransactionErrorParameters = Omit<
  SendTransactionParameters,
  'account' | 'chain'
> & {
  account: Account
  chain?: Chain | undefined
  docsPath?: string | undefined
}

export type GetTransactionErrorReturnType<cause = ErrorType> = Omit<
  TransactionExecutionErrorType,
  'cause'
> & { cause: cause | GetNodeErrorReturnType }

export function getTransactionError<err extends ErrorType<string>>(
  err: err,
  { docsPath, ...args }: GetTransactionErrorParameters,
): GetTransactionErrorReturnType<err> {
  const cause = (() => {
    const cause = getNodeError(
      err as {} as BaseError,
      args as GetNodeErrorParameters,
    )
    if (cause instanceof UnknownNodeError) return err as {} as BaseError
    return cause
  })()
  return new TransactionExecutionError(cause, {
    docsPath,
    ...args,
  }) as GetTransactionErrorReturnType<err>
}
