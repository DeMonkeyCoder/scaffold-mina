import type { Address } from 'abitype'

import {
  type ReadContractErrorType,
  readContract,
} from '../../actions/public/readContract'
import type { PrepareTransactionRequestErrorType } from '../../actions/wallet/prepareTransactionRequest'
import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Chain, GetChainParameter } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'
import { getChainContractAddress } from '../../utils/chain/getChainContractAddress'
import type { HexToNumberErrorType } from '../../utils/encoding/fromHex'

import { gasPriceOracleAbi } from '../abis'
import { contracts } from '../contracts'

export type GetL1BaseFeeParameters<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = undefined,
> = GetChainParameter<chain, chainOverride> & {
  /** Gas price oracle address. */
  gasPriceOracleAddress?: Address | undefined
}

export type GetL1BaseFeeReturnType = bigint

export type GetL1BaseFeeErrorType =
  | RequestErrorType
  | PrepareTransactionRequestErrorType
  | HexToNumberErrorType
  | ReadContractErrorType
  | ErrorType

/**
 * get the L1 base fee
 *
 * @param client - Client to use
 * @param parameters - {@link GetL1BaseFeeParameters}
 * @returns The basefee (in wei). {@link GetL1BaseFeeReturnType}
 *
 * @example
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { getL1BaseFee } from 'viem/chains/optimism'
 *
 * const client = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 * const l1BaseFee = await getL1BaseFee(client)
 */
export async function getL1BaseFee<
  chain extends Chain | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain>,
  args?: GetL1BaseFeeParameters<chain, chainOverride> | undefined,
): Promise<GetL1BaseFeeReturnType> {
  const {
    chain = client.chain,
    gasPriceOracleAddress: gasPriceOracleAddress_,
  } = args || {}

  const gasPriceOracleAddress = (() => {
    if (gasPriceOracleAddress_) return gasPriceOracleAddress_
    if (chain)
      return getChainContractAddress({
        chain,
        contract: 'gasPriceOracle',
      })
    return contracts.gasPriceOracle.address
  })()

  return readContract(client, {
    abi: gasPriceOracleAbi,
    address: gasPriceOracleAddress,
    functionName: 'l1BaseFee',
  })
}
