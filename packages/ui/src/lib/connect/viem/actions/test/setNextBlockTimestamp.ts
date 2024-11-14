import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'
import { numberToHex } from '../../utils/encoding/toHex'

export type SetNextBlockTimestampParameters = {
  /** The timestamp (in seconds). */
  timestamp: bigint
}

export type SetNextBlockTimestampErrorType = RequestErrorType | ErrorType

/**
 * Sets the next block's timestamp.
 *
 * - Docs: https://viem.sh/docs/actions/test/setNextBlockTimestamp
 *
 * @param client - Client to use
 * @param parameters – {@link SetNextBlockTimestampParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setNextBlockTimestamp } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setNextBlockTimestamp(client, { timestamp: 1671744314n })
 */
export async function setNextBlockTimestamp<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { timestamp }: SetNextBlockTimestampParameters,
) {
  await client.request({
    method: 'evm_setNextBlockTimestamp',
    params: [numberToHex(timestamp)],
  })
}
