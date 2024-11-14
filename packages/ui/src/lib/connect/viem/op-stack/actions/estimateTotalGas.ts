import {
  type EstimateGasErrorType,
  type EstimateGasParameters,
  estimateGas,
} from '../../actions/public/estimateGas'
import {
  type PrepareTransactionRequestErrorType,
  type PrepareTransactionRequestParameters,
  prepareTransactionRequest,
} from '../../actions/wallet/prepareTransactionRequest'
import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'
import {
  type EstimateL1GasErrorType,
  type EstimateL1GasParameters,
  estimateL1Gas,
} from './estimateL1Gas'

export type EstimateTotalGasParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
> = EstimateL1GasParameters<chain, account, chainOverride>

export type EstimateTotalGasReturnType = bigint

export type EstimateTotalGasErrorType =
  | RequestErrorType
  | PrepareTransactionRequestErrorType
  | EstimateL1GasErrorType
  | EstimateGasErrorType
  | ErrorType

/**
 * Estimates the amount of L1 data gas + L2 gas required to execute an L2 transaction.
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateTotalGasParameters}
 * @returns The gas estimate. {@link EstimateTotalGasReturnType}
 *
 * @example
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { estimateTotalGas } from 'viem/chains/optimism'
 *
 * const client = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 * const totalGas = await estimateTotalGas(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: parseEther('1'),
 * })
 */
export async function estimateTotalGas<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  args: EstimateTotalGasParameters<chain, account, chainOverride>,
): Promise<EstimateTotalGasReturnType> {
  // Populate transaction with required fields to accurately estimate gas.
  const request = await prepareTransactionRequest(
    client,
    args as PrepareTransactionRequestParameters,
  )

  const [l1Gas, l2Gas] = await Promise.all([
    estimateL1Gas(client, request as EstimateL1GasParameters),
    estimateGas(client, request as EstimateGasParameters),
  ])

  return l1Gas + l2Gas
}
