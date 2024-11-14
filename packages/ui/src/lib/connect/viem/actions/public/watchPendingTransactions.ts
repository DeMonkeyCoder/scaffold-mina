import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { Filter } from "../../types/filter";
import type { Hash } from "../../types/misc";
import type { GetPollOptions } from "../../types/transport";
import { getAction } from "../../utils/getAction";
import { type ObserveErrorType, observe } from "../../utils/observe";
import { poll } from "../../utils/poll";
import { type StringifyErrorType, stringify } from "../../utils/stringify";

import { createPendingTransactionFilter } from "./createPendingTransactionFilter";
import { getFilterChanges } from "./getFilterChanges";
import { uninstallFilter } from "./uninstallFilter";

export type OnTransactionsParameter = Hash[];
export type OnTransactionsFn = (transactions: OnTransactionsParameter) => void;

export type WatchPendingTransactionsParameters<
  transport extends Transport = Transport
> = {
  /** The callback to call when an error occurred when trying to get for a new block. */
  onError?: ((error: Error) => void) | undefined;
  /** The callback to call when new transactions are received. */
  onTransactions: OnTransactionsFn;
} & GetPollOptions<transport>;

export type WatchPendingTransactionsReturnType = () => void;

export type WatchPendingTransactionsErrorType =
  | StringifyErrorType
  | ObserveErrorType
  | ErrorType;

/**
 * Watches and returns pending transaction hashes.
 *
 * - Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
 * - JSON-RPC Methods:
 *   - When `poll: true`
 *     - Calls [`mina_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newpendingtransactionfilter) to initialize the filter.
 *     - Calls [`mina_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getFilterChanges) on a polling interval.
 *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`mina_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.
 *
 * This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).
 *
 * @param client - Client to use
 * @param parameters - {@link WatchPendingTransactionsParameters}
 * @returns A function that can be invoked to stop watching for new pending transaction hashes. {@link WatchPendingTransactionsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchPendingTransactions } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = await watchPendingTransactions(client, {
 *   onTransactions: (hashes) => console.log(hashes),
 * })
 */
export function watchPendingTransactions<
  transport extends Transport,
  chain extends Chain | undefined
>(
  client: Client<transport, chain>,
  {
    batch = true,
    onError,
    onTransactions,
    poll: poll_,
    pollingInterval = client.pollingInterval,
  }: WatchPendingTransactionsParameters<transport>
) {
  const enablePolling =
    typeof poll_ !== "undefined"
      ? poll_
      : client.transport.type !== "webSocket";

  const pollPendingTransactions = () => {
    const observerId = stringify([
      "watchPendingTransactions",
      client.uid,
      batch,
      pollingInterval,
    ]);
    return observe(observerId, { onTransactions, onError }, (emit) => {
      let filter: Filter<"transaction">;

      const unwatch = poll(
        async () => {
          try {
            if (!filter) {
              try {
                filter = await getAction(
                  client,
                  createPendingTransactionFilter,
                  "createPendingTransactionFilter"
                )({});
                return;
              } catch (err) {
                unwatch();
                throw err;
              }
            }

            const hashes = await getAction(
              client,
              getFilterChanges,
              "getFilterChanges"
            )({ filter });
            if (hashes.length === 0) return;
            if (batch) emit.onTransactions(hashes);
            else for (const hash of hashes) emit.onTransactions([hash]);
          } catch (err) {
            emit.onError?.(err as Error);
          }
        },
        {
          emitOnBegin: true,
          interval: pollingInterval,
        }
      );

      return async () => {
        if (filter)
          await getAction(
            client,
            uninstallFilter,
            "uninstallFilter"
          )({ filter });
        unwatch();
      };
    });
  };

  const subscribePendingTransactions = () => {
    let active = true;
    let unsubscribe = () => (active = false);
    (async () => {
      try {
        const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
          params: ["newPendingTransactions"],
          onData(data: any) {
            if (!active) return;
            const transaction = data.result;
            onTransactions([transaction]);
          },
          onError(error: Error) {
            onError?.(error);
          },
        });
        unsubscribe = unsubscribe_;
        if (!active) unsubscribe();
      } catch (err) {
        onError?.(err as Error);
      }
    })();
    return () => unsubscribe();
  };

  return enablePolling
    ? pollPendingTransactions()
    : subscribePendingTransactions();
}
