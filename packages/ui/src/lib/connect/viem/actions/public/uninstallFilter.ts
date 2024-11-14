import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { Filter } from "../../types/filter";
import type { RequestErrorType } from "../../utils/buildRequest";

export type UninstallFilterParameters = {
  filter: Filter<any>;
};
export type UninstallFilterReturnType = boolean;

export type UninstallFilterErrorType = RequestErrorType | ErrorType;

/**
 * Destroys a [`Filter`](https://viem.sh/docs/glossary/types#filter).
 *
 * - Docs: https://viem.sh/docs/actions/public/uninstallFilter
 * - JSON-RPC Methods: [`mina_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_uninstallFilter)
 *
 * Destroys a Filter that was created from one of the following Actions:
 * - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
 * - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
 * - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
 *
 * @param client - Client to use
 * @param parameters - {@link UninstallFilterParameters}
 * @returns A boolean indicating if the Filter was successfully uninstalled. {@link UninstallFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'
 *
 * const filter = await createPendingTransactionFilter(client)
 * const uninstalled = await uninstallFilter(client, { filter })
 * // true
 */
export async function uninstallFilter<
  transport extends Transport,
  chain extends Chain | undefined
>(
  _client: Client<transport, chain>,
  { filter }: UninstallFilterParameters
): Promise<UninstallFilterReturnType> {
  return filter.request({
    method: "mina_uninstallFilter",
    params: [filter.id],
  });
}
