import type { ChainFormatters } from '../types/chain'
import type { RpcTransaction } from '../types/rpc'
import { hexToBigInt } from '../utils/encoding/fromHex'
import { defineBlock } from '../utils/formatters/block'
import {
  defineTransaction,
  formatTransaction,
} from '../utils/formatters/transaction'
import { defineTransactionRequest } from '../utils/formatters/transactionRequest'
import type {
  CeloBlock,
  CeloRpcBlock,
  CeloRpcTransaction,
  CeloRpcTransactionRequest,
  CeloTransaction,
  CeloTransactionRequest,
} from './types'
import { isCIP64 } from './utils'

export const formatters = {
  block: /*#__PURE__*/ defineBlock({
    format(args: CeloRpcBlock): CeloBlock {
      const transactions = args.transactions?.map((transaction) => {
        if (typeof transaction === 'string') return transaction
        const formatted = formatTransaction(transaction as RpcTransaction)
        return {
          ...formatted,
          ...(transaction.gatewayFee
            ? {
                gatewayFee: hexToBigInt(transaction.gatewayFee),
                gatewayFeeRecipient: transaction.gatewayFeeRecipient,
              }
            : {}),
          feeCurrency: transaction.feeCurrency,
        }
      })
      return {
        transactions,
        ...(args.randomness ? { randomness: args.randomness } : {}),
      } as CeloBlock
    },
  }),
  transaction: /*#__PURE__*/ defineTransaction({
    format(args: CeloRpcTransaction): CeloTransaction {
      if (args.type === '0x7e')
        return {
          isSystemTx: args.isSystemTx,
          mint: args.mint ? hexToBigInt(args.mint) : undefined,
          sourceHash: args.sourceHash,
          type: 'deposit',
        } as CeloTransaction

      const transaction = { feeCurrency: args.feeCurrency } as CeloTransaction

      if (args.type === '0x7b') transaction.type = 'cip64'
      else {
        if (args.type === '0x7c') transaction.type = 'cip42'

        transaction.gatewayFee = args.gatewayFee
          ? hexToBigInt(args.gatewayFee)
          : null
        transaction.gatewayFeeRecipient = args.gatewayFeeRecipient
      }

      return transaction
    },
  }),
  transactionRequest: /*#__PURE__*/ defineTransactionRequest({
    format(args: CeloTransactionRequest): CeloRpcTransactionRequest {
      const request = {} as CeloRpcTransactionRequest

      if (args.feeCurrency) request.feeCurrency = args.feeCurrency
      if (isCIP64(args)) request.type = '0x7b'

      return request
    },
  }),
} as const satisfies ChainFormatters
