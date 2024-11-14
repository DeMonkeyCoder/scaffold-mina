import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { Filter } from "../../types/filter";
import type { RequestErrorType } from "../../utils/buildRequest";
import { createFilterRequestScope } from "../../utils/filters/createFilterRequestScope";

export type CreatePendingTransactionFilterReturnType = Filter<"transaction">;

export type CreatePendingTransactionFilterErrorType =
  | RequestErrorType
  | ErrorType;

/**
 * Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
 *
 * - Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
 * - JSON-RPC Methods: [`mina_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newpendingtransactionfilter)
 *
 * @param client - Client to use
 * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateBlockFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createPendingTransactionFilter } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createPendingTransactionFilter(client)
 * // { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
 */
export async function createPendingTransactionFilter<
  transport extends Transport,
  chain extends Chain | undefined
>(
  client: Client<transport, chain>
): Promise<CreatePendingTransactionFilterReturnType> {
  const getRequest = createFilterRequestScope(client, {
    method: "mina_newPendingTransactionFilter",
  });
  const id = await client.request({
    method: "mina_newPendingTransactionFilter",
  });
  return { id, request: getRequest(id), type: "transaction" };
}
