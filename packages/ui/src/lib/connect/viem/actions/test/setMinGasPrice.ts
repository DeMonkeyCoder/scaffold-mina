import type {
  TestClient,
  TestClientMode,
} from "../../clients/createTestClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Account } from "../../types/account";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";
import { numberToHex } from "../../utils/encoding/toHex";

export type SetMinGasPriceParameters = {
  /** The gas price. */
  gasPrice: bigint;
};

export type SetMinGasPriceErrorType = RequestErrorType | ErrorType;

/**
 * Change the minimum gas price accepted by the network (in wei).
 *
 * - Docs: https://viem.sh/docs/actions/test/setMinGasPrice
 *
 * Note: `setMinGasPrice` can only be used on clients that do not have EIP-1559 enabled.
 *
 * @param client - Client to use
 * @param parameters – {@link SetBlockGasLimitParameters}
 *
 * @example
 * import { createTestClient, http, parseGwei } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setMinGasPrice } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setMinGasPrice(client, {
 *   gasPrice: parseGwei('20'),
 * })
 */
export async function setMinGasPrice<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { gasPrice }: SetMinGasPriceParameters
) {
  await client.request({
    method: `${client.mode}_setMinGasPrice`,
    params: [numberToHex(gasPrice)],
  });
}
