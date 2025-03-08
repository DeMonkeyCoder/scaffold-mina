import type { Address, TransactionRequest, UnionOmit } from '@/lib/connect/viem'

import type {
  SendPaymentArgs,
  SendStakeDelegationArgs,
  SendTransactionArgs,
} from '@aurowallet/mina-provider' // import type {SendSignedTransactionErrorType} from './sendSignedTransaction'
import { formatMina } from '@mina-js/utils' // import type {SendSignedTransactionErrorType} from './sendSignedTransaction'
import type { Account } from '../../accounts/types'
import {
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/utils/parseAccount'
import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import {
  AccountNotFoundError,
  AccountTypeNotSupportedError,
} from '../../errors/account'
import { BaseError } from '../../errors/base'
import type { ErrorType } from '../../errors/utils'
import type { GetAccountParameter } from '../../types/account'
import type { Chain, GetChainParameter } from '../../types/chain'
import type { Hash } from '../../types/misc'
import { assertCurrentChain } from '../../utils/chain/assertCurrentChain'
import { getAction } from '../../utils/getAction'
import {
  type AssertRequestParameters,
  assertRequest,
} from '../../utils/transaction/assertRequest'
import { getNetworkId } from '../public/getNetworkId'

export type SendTransactionRequest = UnionOmit<TransactionRequest, 'from'>

export type SendTransactionParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  request extends SendTransactionRequest = SendTransactionRequest,
> = request &
  GetAccountParameter<account, Account | Address, true, true> &
  GetChainParameter<chain, chainOverride>

export type SendTransactionReturnType = Hash

export type TransactionTypeNotSupportedErrorType =
  TransactionTypeNotSupportedError & {
    name: 'TransactionTypeNotSupportedError'
  }
export class TransactionTypeNotSupportedError extends BaseError {
  constructor({
    docsPath,
    metaMessages,
    type,
  }: {
    docsPath?: string | undefined
    metaMessages?: string[] | undefined
    type: string
  }) {
    super(`Transaction type "${type}" is not supported.`, {
      docsPath,
      metaMessages,
      name: 'TransactionTypeNotSupportedError',
    })
  }
}

export type SendTransactionErrorType =
  | ParseAccountErrorType
  // TODO: implement getTransactionError function
  // | GetTransactionErrorReturnType<
  //     | AccountNotFoundErrorType
  //     | AccountTypeNotSupportedErrorType
  //     | AssertCurrentChainErrorType
  //     | AssertRequestErrorType
  //     | GetNetworkIdErrorType
  //     | SendSignedTransactionErrorType
  //     | SignTransactionErrorType
  //     | RequestErrorType
  //   >
  | TransactionTypeNotSupportedErrorType
  | ErrorType

/**
 * Creates, signs, and sends a new transaction to the network.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendTransaction
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
 *   - Local Accounts: [`eth_sendSignedTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
 *
 * @param client - Client to use
 * @param parameters - {@link SendTransactionParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await sendTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await sendTransaction(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
export async function sendTransaction<
  chain extends Chain | undefined,
  account extends Account | undefined,
  const request extends TransactionRequest,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SendTransactionParameters<chain, account, chainOverride, request>,
): Promise<SendTransactionReturnType> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    ...rest
  } = parameters

  if (typeof account_ === 'undefined') throw new AccountNotFoundError()
  const account = account_ ? parseAccount(account_) : null

  // try {
  assertRequest(parameters as AssertRequestParameters)
  if (account?.type === 'json-rpc' || account === null) {
    if (chain !== null) {
      const networkId = await getAction(
        client,
        getNetworkId,
        'getNetworkId',
      )({})
      assertCurrentChain({
        currentNetworkId: networkId,
        chain,
      })
    }
    switch (parameters.type) {
      case 'zkapp': {
        const auroWalletTransactionParams: SendTransactionArgs = {
          transaction: JSON.stringify(parameters.zkappCommand),
          feePayer: parameters.feePayer
            ? {
                fee: parameters.feePayer.fee
                  ? Number(formatMina(parameters.feePayer.fee))
                  : undefined,
                memo: parameters.feePayer.memo,
              }
            : undefined,
        }
        const res = (await client.request(
          {
            // @ts-ignore
            method: 'mina_sendTransaction',
            // @ts-ignore
            params: auroWalletTransactionParams,
          },
          { retryCount: 0 },
        )) as { hash: string }
        return res.hash
      }
      case 'payment': {
        const auroWalletPaymentParams: SendPaymentArgs = {
          to: parameters.to,
          fee: parameters.fee ? Number(formatMina(parameters.fee)) : undefined,
          amount: Number(formatMina(parameters.amount)),
          memo: parameters.memo,
          nonce: parameters.nonce ? Number(parameters.nonce) : undefined,
        }
        const res = (await client.request(
          {
            // @ts-ignore
            method: 'mina_sendPayment',
            // @ts-ignore
            params: auroWalletPaymentParams,
          },
          { retryCount: 0 },
        )) as { hash: string }
        return res.hash
      }
      case 'delegation': {
        const auroWalletDelegationParams: SendStakeDelegationArgs = {
          to: parameters.to,
          fee: parameters.fee ? Number(formatMina(parameters.fee)) : undefined,
          memo: parameters.memo,
          nonce: parameters.nonce ? Number(parameters.nonce) : undefined,
        }
        return (
          (await client.request(
            {
              // @ts-ignore
              method: 'mina_sendStakeDelegation',
              // @ts-ignore
              params: auroWalletDelegationParams,
            },
            { retryCount: 0 },
          )) as { hash: string }
        ).hash
      }
      default:
        throw new TransactionTypeNotSupportedError({
          type: rest.type,
        })
    }
  }

  throw new AccountTypeNotSupportedError({
    type: (account as any)?.type,
  })
  // TODO: implement getTransactionError function
  // } catch (err) {
  //   if (
  //     err instanceof AccountTypeNotSupportedError ||
  //     err instanceof TransactionTypeNotSupportedError
  //   )
  //     throw err
  //   throw getTransactionError(err as BaseError, {
  //     ...parameters,
  //     account,
  //     chain: parameters.chain || undefined,
  //   })
  // }
}
