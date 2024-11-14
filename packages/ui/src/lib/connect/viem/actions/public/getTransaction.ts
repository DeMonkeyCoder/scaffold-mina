import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import { TransactionNotFoundError } from "../../errors/transaction";
import type { ErrorType } from "../../errors/utils";
import type { BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";
import type { Hash } from "../../types/misc";
import type { RpcTransaction } from "../../types/rpc";
import type { Prettify } from "../../types/utils";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  type NumberToHexErrorType,
  numberToHex,
} from "../../utils/encoding/toHex";
import {
  type FormattedTransaction,
  formatTransaction,
} from "../../utils/formatters/transaction";

export type GetTransactionParameters<blockTag extends BlockTag = "latest"> =
  | {
      /** The block hash */
      blockHash: Hash;
      blockNumber?: undefined;
      blockTag?: undefined;
      hash?: undefined;
      /** The index of the transaction on the block. */
      index: number;
    }
  | {
      blockHash?: undefined;
      /** The block number */
      blockNumber: bigint;
      blockTag?: undefined;
      hash?: undefined;
      /** The index of the transaction on the block. */
      index: number;
    }
  | {
      blockHash?: undefined;
      blockNumber?: undefined;
      /** The block tag. */
      blockTag: blockTag | BlockTag;
      hash?: undefined;
      /** The index of the transaction on the block. */
      index: number;
    }
  | {
      blockHash?: undefined;
      blockNumber?: undefined;
      blockTag?: undefined;
      /** The hash of the transaction. */
      hash: Hash;
      index?: number | undefined;
    };

export type GetTransactionReturnType<
  chain extends Chain | undefined = undefined,
  blockTag extends BlockTag = "latest"
> = Prettify<FormattedTransaction<chain, blockTag>>;

export type GetTransactionErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType;

/**
 * Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransaction
 * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
 * - JSON-RPC Methods: [`mina_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getTransactionByHash)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionParameters}
 * @returns The transaction information. {@link GetTransactionReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransaction } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transaction = await getTransaction(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
export async function getTransaction<
  chain extends Chain | undefined,
  blockTag extends BlockTag = "latest"
>(
  client: Client<Transport, chain>,
  {
    blockHash,
    blockNumber,
    blockTag: blockTag_,
    hash,
    index,
  }: GetTransactionParameters<blockTag>
): Promise<GetTransactionReturnType<chain, blockTag>> {
  const blockTag = blockTag_ || "latest";

  const blockNumberHex =
    blockNumber !== undefined ? numberToHex(blockNumber) : undefined;

  let transaction: RpcTransaction | null = null;
  if (hash) {
    transaction = await client.request(
      {
        method: "mina_getTransactionByHash",
        params: [hash],
      },
      { dedupe: true }
    );
  } else if (blockHash) {
    transaction = await client.request(
      {
        method: "mina_getTransactionByBlockHashAndIndex",
        params: [blockHash, numberToHex(index)],
      },
      { dedupe: true }
    );
  } else if (blockNumberHex || blockTag) {
    transaction = await client.request(
      {
        method: "mina_getTransactionByBlockNumberAndIndex",
        params: [blockNumberHex || blockTag, numberToHex(index)],
      },
      { dedupe: Boolean(blockNumberHex) }
    );
  }

  if (!transaction)
    throw new TransactionNotFoundError({
      blockHash,
      blockNumber,
      blockTag,
      hash,
      index,
    });

  const format =
    client.chain?.formatters?.transaction?.format || formatTransaction;
  return format(transaction);
}
