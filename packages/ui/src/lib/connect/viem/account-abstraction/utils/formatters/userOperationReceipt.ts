import type { ErrorType } from '../../../errors/utils'
import { formatLog } from '../../../utils/formatters/log'
import { formatTransactionReceipt } from '../../../utils/formatters/transactionReceipt'
import type { RpcUserOperationReceipt } from '../../types/rpc'
import type { UserOperationReceipt } from '../../types/userOperation'

export type FormatUserOperationReceiptErrorType = ErrorType

export function formatUserOperationReceipt(
  parameters: RpcUserOperationReceipt,
) {
  const receipt = { ...parameters } as unknown as UserOperationReceipt

  if (parameters.actualGasCost)
    receipt.actualGasCost = BigInt(parameters.actualGasCost)
  if (parameters.actualGasUsed)
    receipt.actualGasUsed = BigInt(parameters.actualGasUsed)
  if (parameters.logs)
    receipt.logs = parameters.logs.map((log) => formatLog(log)) as any
  if (parameters.receipt)
    receipt.receipt = formatTransactionReceipt(receipt.receipt as any)

  return receipt
}
