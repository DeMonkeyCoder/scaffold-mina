import type { Account } from "../../accounts/types";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";

export type GetBlobBaseFeeReturnType = bigint;

export type GetBlobBaseFeeErrorType = RequestErrorType | ErrorType;

/**
 * Returns the base fee per blob gas in wei.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
 * - JSON-RPC Methods: [`mina_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_blobBaseFee)
 *
 * @param client - Client to use
 * @returns The blob base fee (in wei). {@link GetBlobBaseFeeReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlobBaseFee } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const blobBaseFee = await getBlobBaseFee(client)
 */
export async function getBlobBaseFee<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: Client<Transport, chain, account>
): Promise<GetBlobBaseFeeReturnType> {
  const baseFee = await client.request({
    method: "mina_blobBaseFee",
  });
  return BigInt(baseFee);
}
