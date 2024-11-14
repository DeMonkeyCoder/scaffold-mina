import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type {
  Chain,
  DeriveChain,
  GetChainParameter,
} from '../../types/chain'
import type { TransactionReceipt } from '../../types/transaction'
import type { OneOf } from '../../types/utils'
import type { GetContractAddressParameter } from '../types/contract'
import {
  type GetPortalVersionErrorType,
  type GetPortalVersionParameters,
  getPortalVersion,
} from './getPortalVersion'
import {
  type GetTimeToNextGameErrorType,
  type GetTimeToNextGameParameters,
  type GetTimeToNextGameReturnType,
  getTimeToNextGame,
} from './getTimeToNextGame'
import {
  type GetTimeToNextL2OutputErrorType,
  type GetTimeToNextL2OutputParameters,
  type GetTimeToNextL2OutputReturnType,
  getTimeToNextL2Output,
} from './getTimeToNextL2Output'

export type GetTimeToProveParameters<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
  OneOf<
    | GetContractAddressParameter<_derivedChain, 'l2OutputOracle'>
    | GetContractAddressParameter<
        _derivedChain,
        'disputeGameFactory' | 'portal'
      >
  > & {
    /**
     * The buffer to account for discrepancies between non-deterministic time intervals.
     * @default 1.1
     */
    intervalBuffer?:
      | GetTimeToNextL2OutputParameters['intervalBuffer']
      | undefined
    receipt: TransactionReceipt
  }

export type GetTimeToProveReturnType =
  | GetTimeToNextGameReturnType
  | GetTimeToNextL2OutputReturnType

export type GetTimeToProveErrorType =
  | GetPortalVersionErrorType
  | GetTimeToNextGameErrorType
  | GetTimeToNextL2OutputErrorType
  | ErrorType

/**
 * Returns the time until the withdrawal transaction is ready to prove. Used for the [Withdrawal](/op-stack/guides/withdrawals) flow.
 *
 * - Docs: https://viem.sh/op-stack/actions/getTimeToProve
 *
 * @param client - Client to use
 * @param parameters - {@link GetTimeToNextL2OutputParameters}
 * @returns Time until prove step is ready. {@link GetTimeToNextL2OutputReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { getBlockNumber } from 'viem/actions'
 * import { mainnet, optimism } from 'viem/chains'
 * import { getTimeToProve } from 'viem/op-stack'
 *
 * const publicClientL1 = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const publicClientL2 = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const receipt = await publicClientL2.getTransactionReceipt({ hash: '0x...' })
 * const { period, seconds, timestamp } = await getTimeToProve(publicClientL1, {
 *   receipt,
 *   targetChain: optimism
 * })
 */
export async function getTimeToProve<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: GetTimeToProveParameters<chain, chainOverride>,
): Promise<GetTimeToProveReturnType> {
  const { receipt } = parameters

  const portalVersion = await getPortalVersion(
    client,
    parameters as GetPortalVersionParameters,
  )

  // Legacy
  if (portalVersion.major < 3)
    return getTimeToNextL2Output(client, {
      ...parameters,
      l2BlockNumber: receipt.blockNumber,
    } as GetTimeToNextL2OutputParameters)

  return getTimeToNextGame(client, {
    ...parameters,
    l2BlockNumber: receipt.blockNumber,
  } as GetTimeToNextGameParameters)
}
