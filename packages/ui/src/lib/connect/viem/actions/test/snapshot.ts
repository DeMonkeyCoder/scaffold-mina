import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'

export type SnapshotErrorType = RequestErrorType | ErrorType

/**
 * Snapshot the state of the blockchain at the current block.
 *
 * - Docs: https://viem.sh/docs/actions/test/snapshot
 *
 * @param client - Client to use
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { snapshot } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await snapshot(client)
 */
export async function snapshot<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: TestClient<TestClientMode, Transport, chain, account, false>) {
  return await client.request({
    method: 'evm_snapshot',
  })
}
