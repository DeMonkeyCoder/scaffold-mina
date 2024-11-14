import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { Filter } from "../../types/filter";
import type { RequestErrorType } from "../../utils/buildRequest";
import { createFilterRequestScope } from "../../utils/filters/createFilterRequestScope";

export type CreateBlockFilterReturnType = Filter<"block">;

export type CreateBlockFilterErrorType = RequestErrorType | ErrorType;

/**
 * Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
 *
 * - Docs: https://viem.sh/docs/actions/public/createBlockFilter
 * - JSON-RPC Methods: [`mina_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newBlockFilter)
 *
 * @param client - Client to use
 * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateBlockFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createBlockFilter } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createBlockFilter(client)
 * // { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
 */
export async function createBlockFilter<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<CreateBlockFilterReturnType> {
  const getRequest = createFilterRequestScope(client, {
    method: "mina_newBlockFilter",
  });
  const id = await client.request({
    method: "mina_newBlockFilter",
  });
  return { id, request: getRequest(id), type: "block" };
}
