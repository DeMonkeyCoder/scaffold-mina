import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'

export type SetRpcUrlErrorType = RequestErrorType | ErrorType

/**
 * Sets the backend RPC URL.
 *
 * - Docs: https://viem.sh/docs/actions/test/setRpcUrl
 *
 * @param client - Client to use
 * @param jsonRpcUrl – RPC URL
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setRpcUrl } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setRpcUrl(client, 'https://eth-mainnet.g.alchemy.com/v2')
 */
export async function setRpcUrl<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  jsonRpcUrl: string,
) {
  await client.request({
    method: `${client.mode}_setRpcUrl`,
    params: [jsonRpcUrl],
  })
}
