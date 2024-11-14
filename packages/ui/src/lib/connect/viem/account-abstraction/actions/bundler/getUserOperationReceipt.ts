import type { Client } from "../../../clients/createClient";
import type { Transport } from "../../../clients/transports/createTransport";
import type { ErrorType } from "../../../errors/utils";
import type { Hash } from "../../../types/misc";
import type { Prettify } from "../../../types/utils";
import type { RequestErrorType } from "../../../utils/buildRequest";
import {
  UserOperationReceiptNotFoundError,
  type UserOperationReceiptNotFoundErrorType,
} from "../../errors/userOperation";
import type { UserOperationReceipt } from "../../types/userOperation";
import { formatUserOperationReceipt } from "../../utils/formatters/userOperationReceipt";

export type GetUserOperationReceiptParameters = {
  /** The hash of the User Operation. */
  hash: Hash;
};

export type GetUserOperationReceiptReturnType = Prettify<UserOperationReceipt>;

export type GetUserOperationReceiptErrorType =
  | RequestErrorType
  | UserOperationReceiptNotFoundErrorType
  | ErrorType;

/**
 * Returns the User Operation Receipt given a User Operation hash.
 *
 * - Docs: https://viem.sh/docs/actions/bundler/getUserOperationReceipt
 *
 * @param client - Client to use
 * @param parameters - {@link GetUserOperationReceiptParameters}
 * @returns The receipt. {@link GetUserOperationReceiptReturnType}
 *
 * @example
 * import { createBundlerClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getUserOperationReceipt } from 'viem/actions
 *
 * const client = createBundlerClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const receipt = await getUserOperationReceipt(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
export async function getUserOperationReceipt(
  client: Client<Transport>,
  { hash }: GetUserOperationReceiptParameters
) {
  const receipt = await client.request(
    {
      method: "mina_getUserOperationReceipt",
      params: [hash],
    },
    { dedupe: true }
  );

  if (!receipt) throw new UserOperationReceiptNotFoundError({ hash });

  return formatUserOperationReceipt(receipt);
}
