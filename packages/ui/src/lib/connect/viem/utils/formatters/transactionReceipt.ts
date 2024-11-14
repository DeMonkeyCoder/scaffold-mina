import type { ErrorType } from '../../errors/utils'
import type {
  Chain,
  ExtractChainFormatterReturnType,
} from '../../types/chain'
import type { RpcTransactionReceipt } from '../../types/rpc'
import type { TransactionReceipt } from '../../types/transaction'
import type { ExactPartial } from '../../types/utils'
import { hexToNumber } from '../encoding/fromHex'

import { type DefineFormatterErrorType, defineFormatter } from './formatter'
import { formatLog } from './log'
import { transactionType } from './transaction'

export type FormattedTransactionReceipt<
  chain extends Chain | undefined = undefined,
> = ExtractChainFormatterReturnType<
  chain,
  'transactionReceipt',
  TransactionReceipt
>

export const receiptStatuses = {
  '0x0': 'reverted',
  '0x1': 'success',
} as const

export type FormatTransactionReceiptErrorType = ErrorType

export function formatTransactionReceipt(
  transactionReceipt: ExactPartial<RpcTransactionReceipt>,
) {
  const receipt = {
    ...transactionReceipt,
    blockNumber: transactionReceipt.blockNumber
      ? BigInt(transactionReceipt.blockNumber)
      : null,
    contractAddress: transactionReceipt.contractAddress
      ? transactionReceipt.contractAddress
      : null,
    cumulativeGasUsed: transactionReceipt.cumulativeGasUsed
      ? BigInt(transactionReceipt.cumulativeGasUsed)
      : null,
    effectiveGasPrice: transactionReceipt.effectiveGasPrice
      ? BigInt(transactionReceipt.effectiveGasPrice)
      : null,
    gasUsed: transactionReceipt.gasUsed
      ? BigInt(transactionReceipt.gasUsed)
      : null,
    logs: transactionReceipt.logs
      ? transactionReceipt.logs.map((log) => formatLog(log))
      : null,
    to: transactionReceipt.to ? transactionReceipt.to : null,
    transactionIndex: transactionReceipt.transactionIndex
      ? hexToNumber(transactionReceipt.transactionIndex)
      : null,
    status: transactionReceipt.status
      ? receiptStatuses[transactionReceipt.status]
      : null,
    type: transactionReceipt.type
      ? transactionType[
          transactionReceipt.type as keyof typeof transactionType
        ] || transactionReceipt.type
      : null,
  } as TransactionReceipt

  if (transactionReceipt.blobGasPrice)
    receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice)
  if (transactionReceipt.blobGasUsed)
    receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed)

  return receipt
}

export type DefineTransactionReceiptErrorType =
  | DefineFormatterErrorType
  | ErrorType

export const defineTransactionReceipt = /*#__PURE__*/ defineFormatter(
  'transactionReceipt',
  formatTransactionReceipt,
)
