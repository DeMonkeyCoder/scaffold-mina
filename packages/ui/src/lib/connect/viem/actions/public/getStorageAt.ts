import type { Address } from "abitype";

import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";
import type { Hex } from "../../types/misc";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  type NumberToHexErrorType,
  numberToHex,
} from "../../utils/encoding/toHex";

export type GetStorageAtParameters = {
  address: Address;
  slot: Hex;
} & (
  | {
      blockNumber?: undefined;
      blockTag?: BlockTag | undefined;
    }
  | {
      blockNumber?: bigint | undefined;
      blockTag?: undefined;
    }
);

export type GetStorageAtReturnType = Hex | undefined;

export type GetStorageAtErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType;

/**
 * Returns the value from a storage slot at a given address.
 *
 * - Docs: https://viem.sh/docs/contract/getStorageAt
 * - JSON-RPC Methods: [`mina_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getstorageat)
 *
 * @param client - Client to use
 * @param parameters - {@link GetStorageAtParameters}
 * @returns The value of the storage slot. {@link GetStorageAtReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getStorageAt } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const code = await getStorageAt(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   slot: toHex(0),
 * })
 */
export async function getStorageAt<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  { address, blockNumber, blockTag = "latest", slot }: GetStorageAtParameters
): Promise<GetStorageAtReturnType> {
  const blockNumberHex =
    blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  const data = await client.request({
    method: "mina_getStorageAt",
    params: [address, slot, blockNumberHex || blockTag],
  });
  return data;
}
