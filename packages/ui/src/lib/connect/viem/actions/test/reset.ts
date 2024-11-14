import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'

export type ResetParameters = {
  /** The block number to reset from. */
  blockNumber?: bigint | undefined
  /** The JSON RPC URL. */
  jsonRpcUrl?: string | undefined
}

export type ResetErrorType = RequestErrorType | ErrorType

/**
 * Resets fork back to its original state.
 *
 * - Docs: https://viem.sh/docs/actions/test/reset
 *
 * @param client - Client to use
 * @param parameters – {@link ResetParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { reset } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await reset(client, { blockNumber: 69420n })
 */
export async function reset<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { blockNumber, jsonRpcUrl }: ResetParameters = {},
) {
  await client.request({
    method: `${client.mode}_reset`,
    params: [{ forking: { blockNumber: Number(blockNumber), jsonRpcUrl } }],
  })
}
