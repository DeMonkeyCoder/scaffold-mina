import type { ErrorType } from '../../errors/utils'
import type { Log } from '../../types/log'
import {
  type ParseEventLogsErrorType,
  parseEventLogs,
} from '../../utils/abi/parseEventLogs'
import { portalAbi } from '../abis'

export type ExtractTransactionDepositedLogsParameters = {
  /** An opaque array of logs. */
  logs: Log[]
}

export type ExtractTransactionDepositedLogsReturnType = Log<
  bigint,
  number,
  false,
  undefined,
  true,
  typeof portalAbi,
  'TransactionDeposited'
>[]

export type ExtractTransactionDepositedLogsErrorType =
  | ParseEventLogsErrorType
  | ErrorType

export function extractTransactionDepositedLogs({
  logs,
}: ExtractTransactionDepositedLogsParameters) {
  return parseEventLogs({
    abi: portalAbi,
    eventName: 'TransactionDeposited',
    logs,
  })
}
