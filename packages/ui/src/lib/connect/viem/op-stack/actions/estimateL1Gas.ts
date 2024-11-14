import type { Address } from 'abitype'

import {
  type ReadContractErrorType,
  readContract,
} from '../../actions/public/readContract'
import {
  type PrepareTransactionRequestErrorType,
  type PrepareTransactionRequestParameters,
  prepareTransactionRequest,
} from '../../actions/wallet/prepareTransactionRequest'
import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account, GetAccountParameter } from '../../types/account'
import type { Chain, GetChainParameter } from '../../types/chain'
import type {
  TransactionRequestEIP1559,
  TransactionSerializable,
} from '../../types/transaction'
import type { RequestErrorType } from '../../utils/buildRequest'
import { getChainContractAddress } from '../../utils/chain/getChainContractAddress'
import type { HexToNumberErrorType } from '../../utils/encoding/fromHex'
import {
  type AssertRequestErrorType,
  type AssertRequestParameters,
  assertRequest,
} from '../../utils/transaction/assertRequest'
import {
  type SerializeTransactionErrorType,
  serializeTransaction,
} from '../../utils/transaction/serializeTransaction'
import { gasPriceOracleAbi } from '../abis'
import { contracts } from '../contracts'

export type EstimateL1GasParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
> = Omit<TransactionRequestEIP1559, 'from'> &
  GetAccountParameter<account> &
  GetChainParameter<chain, chainOverride> & {
    /** Gas price oracle address. */
    gasPriceOracleAddress?: Address | undefined
  }

export type EstimateL1GasReturnType = bigint

export type EstimateL1GasErrorType =
  | RequestErrorType
  | PrepareTransactionRequestErrorType
  | AssertRequestErrorType
  | SerializeTransactionErrorType
  | HexToNumberErrorType
  | ReadContractErrorType
  | ErrorType

/**
 * Estimates the L1 data gas required to execute an L2 transaction.
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateL1GasParameters}
 * @returns The gas estimate. {@link EstimateL1GasReturnType}
 *
 * @example
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { estimateL1Gas } from 'viem/chains/optimism'
 *
 * const client = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 * const l1Gas = await estimateL1Gas(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: parseEther('1'),
 * })
 */
export async function estimateL1Gas<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  args: EstimateL1GasParameters<chain, account, chainOverride>,
): Promise<EstimateL1GasReturnType> {
  const {
    chain = client.chain,
    gasPriceOracleAddress: gasPriceOracleAddress_,
  } = args

  const gasPriceOracleAddress = (() => {
    if (gasPriceOracleAddress_) return gasPriceOracleAddress_
    if (chain)
      return getChainContractAddress({
        chain,
        contract: 'gasPriceOracle',
      })
    return contracts.gasPriceOracle.address
  })()

  // Populate transaction with required fields to accurately estimate gas.
  const request = await prepareTransactionRequest(
    client,
    args as PrepareTransactionRequestParameters,
  )

  assertRequest(request as AssertRequestParameters)

  const transaction = serializeTransaction({
    ...request,
    type: 'eip1559',
  } as TransactionSerializable)

  return readContract(client, {
    abi: gasPriceOracleAbi,
    address: gasPriceOracleAddress,
    functionName: 'getL1GasUsed',
    args: [transaction as any],
  })
}
