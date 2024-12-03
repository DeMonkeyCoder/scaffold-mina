import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  getCache,
  type GetCacheErrorType,
  withCache,
} from "../../utils/promise/withCache";

export type GetBlockHashParameters = {
  /** Time (in ms) that cached block number will remain in memory. */
  cacheTime?: number | undefined;
};

export type GetBlockHashReturnType = string;

export type GetBlockHashErrorType = RequestErrorType | ErrorType;

const cacheKey = (id: string) => `blockNumber.${id}`;

/** @internal */
export type GetBlockHashCacheErrorType = GetCacheErrorType | ErrorType;

/** @internal */
export function getBlockHashCache(id: string) {
  return getCache(cacheKey(id));
}

/**
 * Returns the number of the most recent block seen.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlockHash
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
 * - JSON-RPC Methods: [`mina_blockHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_blocknumber)
 *
 * @param client - Client to use
 * @param parameters - {@link GetBlockHashParameters}
 * @returns The number of the block. {@link GetBlockHashReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlockHash } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const blockNumber = await getBlockHash(client)
 * // 69420n
 */
export async function getBlockHash<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  { cacheTime = client.cacheTime }: GetBlockHashParameters = {}
): Promise<GetBlockHashReturnType> {
  return withCache(
    () =>
      client.request({
        method: "mina_blockHash",
      }),
    { cacheKey: cacheKey(client.uid), cacheTime }
  );
}
