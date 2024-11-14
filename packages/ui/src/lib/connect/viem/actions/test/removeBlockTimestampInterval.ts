import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'

export type RemoveBlockTimestampIntervalErrorType = RequestErrorType | ErrorType

/**
 * Removes [`setBlockTimestampInterval`](https://viem.sh/docs/actions/test/setBlockTimestampInterval) if it exists.
 *
 * - Docs: https://viem.sh/docs/actions/test/removeBlockTimestampInterval
 *
 * @param client - Client to use
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { removeBlockTimestampInterval } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await removeBlockTimestampInterval(client)
 */
export async function removeBlockTimestampInterval<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: TestClient<TestClientMode, Transport, chain, account, false>) {
  await client.request({
    method: `${client.mode}_removeBlockTimestampInterval`,
  })
}
