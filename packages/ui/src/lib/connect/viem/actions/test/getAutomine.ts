import type {
  TestClient,
  TestClientMode,
} from "../../clients/createTestClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Account } from "../../types/account";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";

export type GetAutomineReturnType = boolean;

export type GetAutomineErrorType = RequestErrorType | ErrorType;

/**
 * Returns the automatic mining status of the node.
 *
 * - Docs: https://viem.sh/docs/actions/test/getAutomine
 *
 * @param client - Client to use
 * @returns Whether or not the node is auto mining. {@link GetAutomineReturnType}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { getAutomine } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * const isAutomining = await getAutomine(client)
 */
export async function getAutomine<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>
): Promise<GetAutomineReturnType> {
  if (client.mode === "ganache")
    return await client.request({
      method: "mina_mining",
    });
  return await client.request({
    method: `${client.mode}_getAutomine`,
  });
}
