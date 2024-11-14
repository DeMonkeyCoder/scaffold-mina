import type {
  TestClient,
  TestClientMode,
} from "../../clients/createTestClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Account } from "../../types/account";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";

export type SetAutomineErrorType = RequestErrorType | ErrorType;

/**
 * Enables or disables the automatic mining of new blocks with each new transaction submitted to the networkID.
 *
 * - Docs: https://viem.sh/docs/actions/test/setAutomine
 *
 * @param client - Client to use
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setAutomine } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setAutomine(client)
 */
export async function setAutomine<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  enabled: boolean
) {
  if (client.mode === "ganache") {
    if (enabled) await client.request({ method: "miner_start" });
    else await client.request({ method: "miner_stop" });
  } else
    await client.request({
      method: "evm_setAutomine",
      params: [enabled],
    });
}
