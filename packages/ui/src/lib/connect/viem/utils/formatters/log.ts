import type { ErrorType } from '../../errors/utils'
import type { Log } from '../../types/log'
import type { RpcLog } from '../../types/rpc'
import type { ExactPartial } from '../../types/utils'

export type FormatLogErrorType = ErrorType

export function formatLog(
  log: ExactPartial<RpcLog>,
  {
    args,
    eventName,
  }: { args?: unknown | undefined; eventName?: string | undefined } = {},
) {
  return {
    ...log,
    blockHash: log.blockHash ? log.blockHash : null,
    blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    transactionHash: log.transactionHash ? log.transactionHash : null,
    transactionIndex: log.transactionIndex
      ? Number(log.transactionIndex)
      : null,
    ...(eventName ? { args, eventName } : {}),
  } as Log
}
