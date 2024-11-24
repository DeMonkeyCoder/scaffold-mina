import type { Account } from "../../accounts/types";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";
import { type HexToNumberErrorType } from "../../utils/encoding/fromHex";

export type GetChainIdReturnType = string;

export type GetChainIdErrorType =
  | HexToNumberErrorType
  | RequestErrorType
  | ErrorType;

/**
 * Returns the chain ID associated with the current networkID.
 *
 * - Docs: https://viem.sh/docs/actions/public/getChainId
 * - JSON-RPC Methods: [`mina_networkId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_networkId)
 *
 * @param client - Client to use
 * @returns The current chain ID. {@link GetChainIdReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getChainId } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const chainId = await getChainId(client)
 * // 1
 */
export async function getChainId<
  chain extends Chain | undefined,
  account extends Account | undefined
>(client: Client<Transport, chain, account>): Promise<GetChainIdReturnType> {
  return client.request(
    {
      method: "mina_networkId",
    },
    { dedupe: true }
  );
}
