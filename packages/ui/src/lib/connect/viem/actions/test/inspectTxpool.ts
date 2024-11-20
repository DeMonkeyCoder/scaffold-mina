import type { Address } from "@/lib/connect/viem";

import type {
  TestClient,
  TestClientMode,
} from "../../clients/createTestClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Account } from "../../types/account";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";

export type InspectTxpoolReturnType = {
  pending: Record<Address, Record<string, string>>;
  queued: Record<Address, Record<string, string>>;
};

export type InspectTxpoolErrorType = RequestErrorType | ErrorType;

/**
 * Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.
 *
 * - Docs: https://viem.sh/docs/actions/test/inspectTxpool
 *
 * @param client - Client to use
 * @returns Transaction pool inspection data. {@link InspectTxpoolReturnType}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { inspectTxpool } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * const data = await inspectTxpool(client)
 */
export async function inspectTxpool<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>
): Promise<InspectTxpoolReturnType> {
  return await client.request({
    method: "txpool_inspect",
  });
}
