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

export type StopImpersonatingAccountParameters = {
  /** The account to impersonate. */
  address: Address;
};

export type StopImpersonatingAccountErrorType = RequestErrorType | ErrorType;

/**
 * Stop impersonating an account after having previously used [`impersonateAccount`](https://viem.sh/docs/actions/test/impersonateAccount).
 *
 * - Docs: https://viem.sh/docs/actions/test/stopImpersonatingAccount
 *
 * @param client - Client to use
 * @param parameters – {@link StopImpersonatingAccountParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { stopImpersonatingAccount } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await stopImpersonatingAccount(client, {
 *   address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 * })
 */
export async function stopImpersonatingAccount<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { address }: StopImpersonatingAccountParameters
) {
  await client.request({
    method: `${client.mode}_stopImpersonatingAccount`,
    params: [address],
  });
}
