import type { Account } from "../../accounts/types";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";

export type GetGasPriceReturnType = bigint;

export type GetGasPriceErrorType = RequestErrorType | ErrorType;

/**
 * Returns the current price of gas (in wei).
 *
 * - Docs: https://viem.sh/docs/actions/public/getGasPrice
 * - JSON-RPC Methods: [`mina_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_gasprice)
 *
 * @param client - Client to use
 * @returns The gas price (in wei). {@link GetGasPriceReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getGasPrice } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const gasPrice = await getGasPrice(client)
 */
export async function getGasPrice<
  chain extends Chain | undefined,
  account extends Account | undefined
>(client: Client<Transport, chain, account>): Promise<GetGasPriceReturnType> {
  const gasPrice = await client.request({
    method: "mina_gasPrice",
  });
  return BigInt(gasPrice);
}
