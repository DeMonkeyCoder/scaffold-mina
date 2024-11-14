import type { Account } from '../accounts/types'
import type { EstimateGasParameters } from '../actions/public/estimateGas'
import type { Chain } from '../types/chain'
import { formatEther } from '../utils/unit/formatEther'
import { formatGwei } from '../utils/unit/formatGwei'

import { BaseError } from './base'
import { prettyPrint } from './transaction'

export type EstimateGasExecutionErrorType = EstimateGasExecutionError & {
  name: 'EstimateGasExecutionError'
}
export class EstimateGasExecutionError extends BaseError {
  override cause: BaseError

  constructor(
    cause: BaseError,
    {
      account,
      docsPath,
      chain,
      data,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
    }: Omit<EstimateGasParameters<any>, 'account'> & {
      account?: Account | undefined
      chain?: Chain | undefined
      docsPath?: string | undefined
    },
  ) {
    const prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value:
        typeof value !== 'undefined' &&
        `${formatEther(value)} ${chain?.nativeCurrency?.symbol || 'ETH'}`,
      data,
      gas,
      gasPrice:
        typeof gasPrice !== 'undefined' && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas:
        typeof maxFeePerGas !== 'undefined' &&
        `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas:
        typeof maxPriorityFeePerGas !== 'undefined' &&
        `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce,
    })

    super(cause.shortMessage, {
      cause,
      docsPath,
      metaMessages: [
        ...(cause.metaMessages ? [...cause.metaMessages, ' '] : []),
        'Estimate Gas Arguments:',
        prettyArgs,
      ].filter(Boolean) as string[],
      name: 'EstimateGasExecutionError',
    })
    this.cause = cause
  }
}
