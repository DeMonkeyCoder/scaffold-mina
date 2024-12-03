import type { Account } from "../../accounts/types";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";

export type GetNetworkIdReturnType = string;

export type GetNetworkIdErrorType = RequestErrorType | ErrorType;

/**
 * Returns the chain ID associated with the current network.
 *
 * - Docs: https://viem.sh/docs/actions/public/getNetworkId
 * - JSON-RPC Methods: [`mina_networkId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_networkId)
 *
 * @param client - Client to use
 * @returns The current chain ID. {@link GetNetworkIdReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getNetworkId } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const networkId = await getNetworkId(client)
 * // 1
 */
export async function getNetworkId<
  chain extends Chain | undefined,
  account extends Account | undefined
>(client: Client<Transport, chain, account>): Promise<GetNetworkIdReturnType> {
  const response = await client.request(
    {
      method: "mina_networkId",
    },
    { dedupe: true }
  );
  // TODO: Remove this hotfix once the networkId mismatch issue in Devnet is resolved
  if (response === "mina:testnet") return "mina:devnet";
  return response;
}
