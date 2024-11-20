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

export type SetCoinbaseParameters = {
  /** The coinbase address. */
  address: Address;
};

export type SetCoinbaseErrorType = RequestErrorType | ErrorType;

/**
 * Sets the coinbase address to be used in new blocks.
 *
 * - Docs: https://viem.sh/docs/actions/test/setCoinbase
 *
 * @param client - Client to use
 * @param parameters – {@link SetCoinbaseParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setCoinbase } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setCoinbase(client, {
 *   address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
 * })
 */
export async function setCoinbase<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { address }: SetCoinbaseParameters
) {
  await client.request({
    method: `${client.mode}_setCoinbase`,
    params: [address],
  });
}
