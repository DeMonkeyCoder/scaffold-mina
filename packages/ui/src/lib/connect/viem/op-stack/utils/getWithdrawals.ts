import type { ErrorType } from '../../errors/utils'
import type { Log } from '../../types/log'
import type { Withdrawal } from '../types/withdrawal'
import {
  type ExtractWithdrawalMessageLogsErrorType,
  extractWithdrawalMessageLogs,
} from './extractWithdrawalMessageLogs'

export type GetWithdrawalsParameters = {
  /** The L2 transaction receipt logs. */
  logs: Log[]
}

export type GetWithdrawalsReturnType = Withdrawal[]

export type GetWithdrawalsErrorType =
  | ExtractWithdrawalMessageLogsErrorType
  | ErrorType

export function getWithdrawals({
  logs,
}: GetWithdrawalsParameters): GetWithdrawalsReturnType {
  const extractedLogs = extractWithdrawalMessageLogs({ logs })
  return extractedLogs.map((log) => log.args)
}
