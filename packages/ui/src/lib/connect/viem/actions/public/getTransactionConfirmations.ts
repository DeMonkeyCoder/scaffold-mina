import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { Hash } from "../../types/misc";
import type { FormattedTransactionReceipt } from "../../utils/formatters/transactionReceipt";
import { getAction } from "../../utils/getAction";

import { getBlockHash, type GetBlockHashErrorType } from "./getBlockHash";
import { getTransaction, type GetTransactionErrorType } from "./getTransaction";

export type GetTransactionConfirmationsParameters<
  chain extends Chain | undefined = Chain
> =
  | {
      /** The transaction hash. */
      hash: Hash;
      transactionReceipt?: undefined;
    }
  | {
      hash?: undefined;
      /** The transaction receipt. */
      transactionReceipt: FormattedTransactionReceipt<chain>;
    };

export type GetTransactionConfirmationsReturnType = bigint;

export type GetTransactionConfirmationsErrorType =
  | GetBlockHashErrorType
  | GetTransactionErrorType
  | ErrorType;

/**
 * Returns the number of blocks passed (confirmations) since the transaction was processed on a block.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
 * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
 * - JSON-RPC Methods: [`mina_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getTransactionConfirmations)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionConfirmationsParameters}
 * @returns The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. {@link GetTransactionConfirmationsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransactionConfirmations } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const confirmations = await getTransactionConfirmations(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
export async function getTransactionConfirmations<
  chain extends Chain | undefined
>(
  client: Client<Transport, chain>,
  { hash, transactionReceipt }: GetTransactionConfirmationsParameters<chain>
): Promise<GetTransactionConfirmationsReturnType> {
  const [blockNumber, transaction] = await Promise.all([
    getAction(client, getBlockHash, "getBlockHash")({}),
    hash
      ? getAction(client, getTransaction, "getTransaction")({ hash })
      : undefined,
  ]);
  const transactionBlockHash =
    transactionReceipt?.blockNumber || transaction?.blockNumber;
  if (!transactionBlockHash) return 0n;
  return blockNumber - transactionBlockHash! + 1n;
}
