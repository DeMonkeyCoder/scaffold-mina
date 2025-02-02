import type {ErrorType} from '../../errors/utils.js'
import type {Chain, ExtractChainFormatterParameters,} from '../../types/chain.js'
import type {RpcTransactionRequest} from '../../types/rpc.js'
import type {TransactionRequest} from '../../types/transaction.js'
import type {ExactPartial} from '../../types/utils.js'
import {defineFormatter, type DefineFormatterErrorType} from './formatter.js'

export type FormattedTransactionRequest<
  chain extends Chain | undefined = Chain | undefined,
> = ExtractChainFormatterParameters<
  chain,
  'transactionRequest',
  TransactionRequest
>

export const rpcTransactionType = {
  legacy: '0x0',
  eip2930: '0x1',
  eip1559: '0x2',
  eip4844: '0x3',
  eip7702: '0x4',
} as const

export type FormatTransactionRequestErrorType = ErrorType

export function formatTransactionRequest(
  request: ExactPartial<TransactionRequest>,
) {
  const rpcRequest = {} as RpcTransactionRequest

  if (typeof request.type !== 'undefined') rpcRequest.type = request.type
  if (typeof request.zkappCommand !== 'undefined')
    rpcRequest.zkappCommand = request.zkappCommand
  if (typeof request.from !== 'undefined') rpcRequest.from = request.from
  if (typeof request.to !== 'undefined') rpcRequest.to = request.to
  if (typeof request.amount !== 'undefined') rpcRequest.amount = request.amount
  if (typeof request.fee !== 'undefined') rpcRequest.fee = request.fee
  if (typeof request.memo !== 'undefined') rpcRequest.memo = request.memo
  if (typeof request.nonce !== 'undefined') rpcRequest.nonce = request.nonce

  return rpcRequest
}

export type DefineTransactionRequestErrorType =
  | DefineFormatterErrorType
  | ErrorType

export const defineTransactionRequest = /*#__PURE__*/ defineFormatter(
  'transactionRequest',
  formatTransactionRequest,
)
