import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";
import type { FeeHistory } from "../../types/fee";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  type NumberToHexErrorType,
  numberToHex,
} from "../../utils/encoding/toHex";
import {
  type FormatFeeHistoryErrorType,
  formatFeeHistory,
} from "../../utils/formatters/feeHistory";

export type GetFeeHistoryParameters = {
  /**
   * Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query. Less than requested may be returned if not all blocks are available.
   */
  blockCount: number;
  /**
   * A monotonically increasing list of percentile values to sample from each block's effective priority fees per gas in ascending order, weighted by gas used.
   */
  rewardPercentiles: number[];
} & (
  | {
      blockNumber?: undefined;
      /**
       * Highest number block of the requested range.
       * @default 'latest'
       */
      blockTag?: BlockTag | undefined;
    }
  | {
      /** Highest number block of the requested range. */
      blockNumber?: bigint | undefined;
      blockTag?: undefined;
    }
);
export type GetFeeHistoryReturnType = FeeHistory;

export type GetFeeHistoryErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | FormatFeeHistoryErrorType;

/**
 * Returns a collection of historical gas information.
 *
 * - Docs: https://viem.sh/docs/actions/public/getFeeHistory
 * - JSON-RPC Methods: [`mina_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)
 *
 * @param client - Client to use
 * @param parameters - {@link GetFeeHistoryParameters}
 * @returns The gas estimate (in wei). {@link GetFeeHistoryReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getFeeHistory } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const feeHistory = await getFeeHistory(client, {
 *   blockCount: 4,
 *   rewardPercentiles: [25, 75],
 * })
 */
export async function getFeeHistory<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  {
    blockCount,
    blockNumber,
    blockTag = "latest",
    rewardPercentiles,
  }: GetFeeHistoryParameters
): Promise<GetFeeHistoryReturnType> {
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  const feeHistory = await client.request(
    {
      method: "mina_feeHistory",
      params: [
        numberToHex(blockCount),
        blockNumberHex || blockTag,
        rewardPercentiles,
      ],
    },
    { dedupe: Boolean(blockNumberHex) }
  );
  return formatFeeHistory(feeHistory);
}
