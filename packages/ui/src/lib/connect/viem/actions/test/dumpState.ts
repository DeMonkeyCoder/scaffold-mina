import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { Hex } from '../../types/misc'
import type { RequestErrorType } from '../../utils/buildRequest'

export type DumpStateReturnType = Hex
export type DumpStateErrorType = RequestErrorType | ErrorType

/**
 * Serializes the current state (including contracts code, contract's storage,
 * accounts properties, etc.) into a savable data blob.
 *
 * - Docs: https://viem.sh/docs/actions/test/dumpState
 *
 * @param client - Client to use
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { dumpState } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await dumpState(client)
 */
export async function dumpState<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
): Promise<DumpStateReturnType> {
  return client.request({
    method: `${client.mode}_dumpState`,
  })
}
