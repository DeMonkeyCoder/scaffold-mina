import type { Address } from 'abitype'
import {
  type WriteContractErrorType,
  type WriteContractParameters,
  writeContract,
} from '../../actions/wallet/writeContract'
import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account, GetAccountParameter } from '../../types/account'
import type {
  Chain,
  DeriveChain,
  GetChainParameter,
} from '../../types/chain'
import type { Hash } from '../../types/misc'
import type { UnionEvaluate, UnionOmit } from '../../types/utils'
import type { FormattedTransactionRequest } from '../../utils/formatters/transactionRequest'
import { portalAbi } from '../abis'
import type { GetContractAddressParameter } from '../types/contract'
import type { Withdrawal } from '../types/withdrawal'
import {
  type EstimateFinalizeWithdrawalGasErrorType,
  type EstimateFinalizeWithdrawalGasParameters,
  estimateFinalizeWithdrawalGas,
} from './estimateFinalizeWithdrawalGas'

export type FinalizeWithdrawalParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = UnionEvaluate<
  UnionOmit<
    FormattedTransactionRequest<_derivedChain>,
    | 'accessList'
    | 'data'
    | 'from'
    | 'gas'
    | 'gasPrice'
    | 'to'
    | 'type'
    | 'value'
  >
> &
  GetAccountParameter<account, Account | Address> &
  GetChainParameter<chain, chainOverride> &
  GetContractAddressParameter<_derivedChain, 'portal'> & {
    /**
     * Gas limit for transaction execution on the L1.
     * `null` to skip gas estimation & defer calculation to signer.
     */
    gas?: bigint | null | undefined
    withdrawal: Withdrawal
  }
export type FinalizeWithdrawalReturnType = Hash
export type FinalizeWithdrawalErrorType =
  | EstimateFinalizeWithdrawalGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Finalizes a withdrawal that occurred on an L2. Used in the Withdrawal flow.
 *
 * - Docs: https://viem.sh/op-stack/actions/finalizeWithdrawal
 *
 * @param client - Client to use
 * @param parameters - {@link FinalizeWithdrawalParameters}
 * @returns The finalize transaction hash. {@link FinalizeWithdrawalReturnType}
 *
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { mainnet, optimism } from 'viem/chains'
 * import { finalizeWithdrawal } from 'viem/op-stack'
 *
 * const walletClientL1 = createWalletClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const request = await finalizeWithdrawal(walletClientL1, {
 *   targetChain: optimism,
 *   withdrawal: { ... },
 * })
 */
export async function finalizeWithdrawal<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: FinalizeWithdrawalParameters<chain, account, chainOverride>,
): Promise<FinalizeWithdrawalReturnType> {
  const {
    account,
    chain = client.chain,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    targetChain,
    withdrawal,
  } = parameters

  const portalAddress = (() => {
    if (parameters.portalAddress) return parameters.portalAddress
    if (chain) return targetChain!.contracts.portal[chain.id].address
    return Object.values(targetChain!.contracts.portal)[0].address
  })()

  const gas_ =
    typeof gas !== 'number' && gas !== null
      ? await estimateFinalizeWithdrawalGas(
          client,
          parameters as EstimateFinalizeWithdrawalGasParameters,
        )
      : undefined

  return writeContract(client, {
    account: account!,
    abi: portalAbi,
    address: portalAddress,
    chain,
    functionName: 'finalizeWithdrawalTransaction',
    args: [withdrawal],
    gas: gas_,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
  } satisfies WriteContractParameters as any)
}
