import type { ErrorType } from '../../errors/utils'
import type { Log } from '../../types/log'
import type { Hex } from '../../types/misc'
import { extractTransactionDepositedLogs } from './extractTransactionDepositedLogs'
import { getL2TransactionHash } from './getL2TransactionHash'

export type GetL2TransactionHashesParameters = {
  /** The L1 transaction receipt logs. */
  logs: Log[]
}

export type GetL2TransactionHashesReturnType = Hex[]

export type GetL2TransactionHashesErrorType = ErrorType

export function getL2TransactionHashes({
  logs,
}: GetL2TransactionHashesParameters): GetL2TransactionHashesReturnType {
  const extractedLogs = extractTransactionDepositedLogs({ logs })
  return extractedLogs.map((log) => getL2TransactionHash({ log }))
}
