import {
  getBalance,
  type GetBalanceParameters,
  type GetBalanceReturnType,
} from '../../actions/public/getBalance'
import {
  getBlockHash,
  type GetBlockHashParameters,
  type GetBlockHashReturnType,
} from '../../actions/public/getBlockHash'
import {
  getNetworkId,
  type GetNetworkIdReturnType,
} from '../../actions/public/getNetworkId'
import {
  getTransactionCount,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
} from '../../actions/public/getTransactionCount'
import {
  watchBlockHash,
  type WatchBlockHashParameters,
  type WatchBlockHashReturnType,
} from '../../actions/public/watchBlockHash'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { Client } from '../createClient'
import type { Transport } from '../transports/createTransport'

export type PublicActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = {
  /**
   * Returns the balance of an address in wei.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBalance
   * - JSON-RPC Methods: [`mina_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getbalance)
   *
   * @remarks
   * You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).
   *
   * ```ts
   * const balance = await getBalance(client, {
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   blockTag: 'safe'
   * })
   * const balanceAsEther = formatEther(balance)
   * // "6.942"
   * ```
   *
   * @param args - {@link GetBalanceParameters}
   * @returns The balance of the address in wei. {@link GetBalanceReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const balance = await client.getBalance({
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   * // 10000000000000000000000n (wei)
   */
  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>
  /**
   * Returns the number of the most recent block seen.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlockHash
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
   * - JSON-RPC Methods: [`mina_blockHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_blocknumber)
   *
   * @param args - {@link GetBlockHashParameters}
   * @returns The number of the block. {@link GetBlockHashReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const blockNumber = await client.getBlockHash()
   * // 69420n
   */
  getBlockHash: (
    args?: GetBlockHashParameters | undefined,
  ) => Promise<GetBlockHashReturnType>
  /**
   * Returns the chain ID associated with the current network.
   *
   * - Docs: https://viem.sh/docs/actions/public/getNetworkId
   * - JSON-RPC Methods: [`mina_networkId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_networkId)
   *
   * @returns The current chain ID. {@link GetNetworkIdReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const networkId = await client.getNetworkId()
   * // 1
   */
  getNetworkId: () => Promise<GetNetworkIdReturnType>
  /**
   * Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransactionCount
   * - JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)
   *
   * @param args - {@link GetTransactionCountParameters}
   * @returns The number of transactions an account has sent. {@link GetTransactionCountReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transactionCount = await client.getTransactionCount({
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   */
  getTransactionCount: (
    args: GetTransactionCountParameters,
  ) => Promise<GetTransactionCountReturnType>
  /**
   * Watches and returns incoming block numbers.
   *
   * - Docs: https://viem.sh/docs/actions/public/watchBlockHash
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks
   * - JSON-RPC Methods:
   *   - When `poll: true`, calls [`mina_blockHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_blocknumber) on a polling interval.
   *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`mina_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
   *
   * @param args - {@link WatchBlockHashParameters}
   * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlockHashReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = await client.watchBlockHash({
   *   onBlockHash: (blockNumber) => console.log(blockNumber),
   * })
   */
  watchBlockHash: (args: WatchBlockHashParameters) => WatchBlockHashReturnType
}

export function publicActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>(
  client: Client<transport, chain, account>,
): PublicActions<transport, chain, account> {
  return {
    getBalance: (args) => getBalance(client, args),
    getBlockHash: (args) => getBlockHash(client, args),
    getNetworkId: () => getNetworkId(client),
    getTransactionCount: (args) => getTransactionCount(client, args),
    watchBlockHash: (args) => watchBlockHash(client, args),
  }
}
