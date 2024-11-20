import type { Address } from "@/lib/connect/viem";
import type { Client } from "../../../clients/createClient";
import type { Transport } from "../../../clients/transports/createTransport";
import type { ErrorType } from "../../../errors/utils";
import type { Hash } from "../../../types/misc";
import type { Prettify } from "../../../types/utils";
import type { RequestErrorType } from "../../../utils/buildRequest";
import {
  UserOperationNotFoundError,
  type UserOperationNotFoundErrorType,
} from "../../errors/userOperation";
import type { UserOperation } from "../../types/userOperation";
import { formatUserOperation } from "../../utils/formatters/userOperation";

export type GetUserOperationParameters = {
  /** The hash of the User Operation. */
  hash: Hash;
};

export type GetUserOperationReturnType = Prettify<{
  /** The block hash the User Operation was included on. */
  blockHash: Hash;
  /** The block number the User Operation was included on. */
  blockNumber: bigint;
  /** The EntryPoint which handled the User Operation. */
  entryPoint: Address;
  /** The hash of the transaction which included the User Operation. */
  transactionHash: Hash;
  /** The User Operation. */
  userOperation: UserOperation;
}>;

export type GetUserOperationErrorType =
  | RequestErrorType
  | UserOperationNotFoundErrorType
  | ErrorType;

/**
 * Retrieves information about a User Operation given a hash.
 *
 * - Docs: https://viem.sh/docs/actions/bundler/getUserOperation
 *
 * @param client - Client to use
 * @param parameters - {@link GetUserOperationParameters}
 * @returns The receipt. {@link GetUserOperationReturnType}
 *
 * @example
 * import { createBundlerClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getUserOperation } from 'viem/actions
 *
 * const client = createBundlerClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const receipt = await getUserOperation(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
export async function getUserOperation(
  client: Client<Transport>,
  { hash }: GetUserOperationParameters
) {
  const result = await client.request(
    {
      method: "mina_getUserOperationByHash",
      params: [hash],
    },
    { dedupe: true }
  );

  if (!result) throw new UserOperationNotFoundError({ hash });

  const { blockHash, blockNumber, entryPoint, transactionHash, userOperation } =
    result;

  return {
    blockHash,
    blockNumber: BigInt(blockNumber),
    entryPoint,
    transactionHash,
    userOperation: formatUserOperation(userOperation),
  };
}
