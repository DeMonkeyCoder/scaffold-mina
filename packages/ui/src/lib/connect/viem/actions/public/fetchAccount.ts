import type { Address } from '@/lib/connect/viem'

import { PublicKey, fetchAccount as o1js_fetchAccount } from 'o1js'
import type { Account } from 'o1js/dist/node/lib/mina/account'
import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { BlockTag } from '../../types/block'
import type { Chain } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'

export type FetchAccountParameters = {
  /** The address of the account. */
  address: Address
} & (
  | {
      /** The balance of the account at a block number. */
      blockNumber?: bigint | undefined
      blockTag?: undefined
    }
  | {
      blockNumber?: undefined
      /** The balance of the account at a block tag. */
      blockTag?: BlockTag | undefined
    }
)

export type FetchAccountReturnType = Account

export type FetchAccountErrorType = RequestErrorType | ErrorType

/**
 * Returns the balance of an address in wei.
 *
 * - Docs: https://viem.sh/docs/actions/public/fetchAccount
 * - JSON-RPC Methods: [`mina_fetchAccount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getbalance)
 *
 * You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).
 *
 * ```ts
 * const balance = await fetchAccount(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   blockTag: 'safe'
 * })
 * const balanceAsEther = formatEther(balance)
 * // "6.942"
 * ```
 *
 * @param client - Client to use
 * @param parameters - {@link FetchAccountParameters}
 * @returns The balance of the address in wei. {@link FetchAccountReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { fetchAccount } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const balance = await fetchAccount(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 * // 10000000000000000000000n (wei)
 */
export async function fetchAccount<chain extends Chain | undefined>(
  _client: Client<Transport, chain>,
  // { address, blockNumber, blockTag = "latest" }: FetchAccountParameters
  { address }: FetchAccountParameters,
): Promise<FetchAccountReturnType> {
  const result = await o1js_fetchAccount({
    publicKey: PublicKey.fromBase58(address),
  })
  if (result.error) {
    throw result.error
  }
  return result.account
}
