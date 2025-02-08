import type {Signature} from '@/lib/connect/viem'
import {TransactionTypeNotSupportedError} from '@/lib/connect/viem/actions/wallet/sendTransaction'
import type {ZkappCommand} from 'o1js/dist/web/bindings/mina-transaction/gen/transaction-json'
import type {Account} from '../../accounts/types'
import {parseAccount, type ParseAccountErrorType,} from '../../accounts/utils/parseAccount'
import type {Client} from '../../clients/createClient'
import type {Transport} from '../../clients/transports/createTransport'
import {AccountNotFoundError} from '../../errors/account'
import type {ErrorType} from '../../errors/utils'
import type {GetAccountParameter} from '../../types/account'
import type {Chain, GetChainParameter} from '../../types/chain'
import type {UnionOmit} from '../../types/utils'
import type {RequestErrorType} from '../../utils/buildRequest'
import {assertCurrentChain, type AssertCurrentChainErrorType,} from '../../utils/chain/assertCurrentChain'
import type {FormattedTransactionRequest} from '../../utils/formatters/transactionRequest'
import {getAction} from '../../utils/getAction'
import {assertRequest, type AssertRequestErrorType,} from '../../utils/transaction/assertRequest'
import {getNetworkId, type GetNetworkIdErrorType,} from '../public/getNetworkId'

export type SignTransactionRequest = UnionOmit<
  FormattedTransactionRequest,
  'from'
>

export type SignTransactionParameters<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  request extends SignTransactionRequest = SignTransactionRequest,
> = request &
  GetAccountParameter<account> &
  GetChainParameter<chain, chainOverride>

export type SignTransactionReturnType<
  request extends SignTransactionRequest = SignTransactionRequest,
> = request['type'] extends 'zkapp' ? ZkappCommand : Signature

export type SignTransactionErrorType =
  | ParseAccountErrorType
  | AssertRequestErrorType
  | GetNetworkIdErrorType
  | AssertCurrentChainErrorType
  | RequestErrorType
  | ErrorType

/**
 * Signs a transaction.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signTransaction
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * @param args - {@link SignTransactionParameters}
 * @returns The signed serialized transaction. {@link SignTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 */
export async function signTransaction<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
  const request extends SignTransactionRequest = SignTransactionRequest,
>(
  client: Client<Transport, chain, account>,
  parameters: SignTransactionParameters<chain, account, chainOverride, request>,
): Promise<SignTransactionReturnType<request>> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    ...transaction
  } = parameters

  if (!account_) throw new AccountNotFoundError()
  const account = parseAccount(account_)

  assertRequest({
    account,
    ...parameters,
  })

  const networkId = await getAction(client, getNetworkId, 'getNetworkId')({})
  if (chain !== null)
    assertCurrentChain({
      currentNetworkId: networkId,
      chain,
    })

  // if (account.signTransaction)
  //   return account.signTransaction(
  //     {
  //       ...transaction,
  //       networkId,
  //     } as TransactionSerializable,
  //     { serializer: client.chain?.serializers?.transaction },
  //   ) as Promise<SignTransactionReturnType<request>>

  switch (parameters.type) {
    case 'zkapp': {
      const res = (await client.request(
        {
          // @ts-ignore
          method: 'mina_sendTransaction',
          params: {
            // @ts-ignore
            transaction: JSON.stringify(parameters.zkappCommand),
            feePayer: transaction.feePayer,
            onlySign: true,
          },
        },
        { retryCount: 0 },
      )) as { signedData: string }
      return JSON.parse(res.signedData)
        .zkappCommand as SignTransactionReturnType<request>
    }
    case 'payment':
    case 'delegation':
    default:
      throw new TransactionTypeNotSupportedError({
        type: transaction.type,
      })
  }
}
