import type {
  TestClient,
  TestClientMode,
} from "../../clients/createTestClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Account } from "../../types/account";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";

export type SetLoggingEnabledErrorType = RequestErrorType | ErrorType;

/**
 * Enable or disable logging on the test node networkID.
 *
 * - Docs: https://viem.sh/docs/actions/test/setLoggingEnabled
 *
 * @param client - Client to use
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setLoggingEnabled } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setLoggingEnabled(client)
 */
export async function setLoggingEnabled<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  enabled: boolean
) {
  await client.request({
    method: `${client.mode}_setLoggingEnabled`,
    params: [enabled],
  });
}
