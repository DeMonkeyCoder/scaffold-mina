import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { Quantity } from '../../types/rpc'
import type { RequestErrorType } from '../../utils/buildRequest'

export type RevertParameters = {
  /** The snapshot ID to revert to. */
  id: Quantity
}

export type RevertErrorType = RequestErrorType | ErrorType

/**
 * Revert the state of the blockchain at the current block.
 *
 * - Docs: https://viem.sh/docs/actions/test/revert
 *
 * @param client - Client to use
 * @param parameters – {@link RevertParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { revert } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await revert(client, { id: '0x…' })
 */
export async function revert<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { id }: RevertParameters,
) {
  await client.request({
    method: 'evm_revert',
    params: [id],
  })
}
