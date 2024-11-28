import type { Account } from "../../../accounts/types";
import {
  type ParseAccountErrorType,
  parseAccount,
} from "../../../accounts/utils/parseAccount";
import type {
  SignAuthorizationErrorType as SignAuthorizationErrorType_account,
  SignAuthorizationReturnType as SignAuthorizationReturnType_account,
} from "../../../accounts/utils/signAuthorization";
import { getNetworkId } from "../../../actions/public/getNetworkId";
import { getTransactionCount } from "../../../actions/public/getTransactionCount";
import type { Client } from "../../../clients/createClient";
import type { Transport } from "../../../clients/transports/createTransport";
import {
  AccountNotFoundError,
  type AccountNotFoundErrorType,
  AccountTypeNotSupportedError,
  type AccountTypeNotSupportedErrorType,
} from "../../../errors/account";
import type { ErrorType } from "../../../errors/utils";
import type { GetAccountParameter } from "../../../types/account";
import type { Chain } from "../../../types/chain";
import type { PartialBy } from "../../../types/utils";
import type { RequestErrorType } from "../../../utils/buildRequest";
import { getAction } from "../../../utils/getAction";
import type { Authorization } from "../types/authorization";

export type SignAuthorizationParameters<
  account extends Account | undefined = Account | undefined
> = GetAccountParameter<account> &
  PartialBy<Authorization, "networkId" | "nonce">;

export type SignAuthorizationReturnType = SignAuthorizationReturnType_account;

export type SignAuthorizationErrorType =
  | ParseAccountErrorType
  | RequestErrorType
  | AccountNotFoundErrorType
  | AccountTypeNotSupportedErrorType
  | SignAuthorizationErrorType_account
  | ErrorType;

/**
 * Signs an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object.
 *
 * With the calculated signature, you can:
 * - use [`verifyAuthorization`](https://viem.sh/experimental/eip7702/verifyAuthorization) to verify the signed Authorization object,
 * - use [`recoverAuthorizationAddress`](https://viem.sh/experimental/eip7702/recoverAuthorizationAddress) to recover the signing address from the signed Authorization object.
 *
 * @param client - Client to use
 * @param parameters - {@link SignAuthorizationParameters}
 * @returns The signed Authorization object. {@link SignAuthorizationReturnType}
 *
 * @example
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signAuthorization } from 'viem/experimental'
 *
 * const client = createClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const signature = await signAuthorization(client, {
 *   account: privateKeyToAccount('0x..'),
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 *
 * @example
 * // Account Hoisting
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signAuthorization } from 'viem/experimental'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const signature = await signAuthorization(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
export async function signAuthorization<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: Client<Transport, chain, account>,
  parameters: SignAuthorizationParameters<account>
): Promise<SignAuthorizationReturnType> {
  const {
    account: account_ = client.account,
    contractAddress,
    networkId,
    nonce,
  } = parameters;

  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/experimental/eip7702/signAuthorization",
    });
  const account = parseAccount(account_);

  if (!account.experimental_signAuthorization)
    throw new AccountTypeNotSupportedError({
      docsPath: "/experimental/eip7702/signAuthorization",
      metaMessages: [
        "The `signAuthorization` Action does not support JSON-RPC Accounts.",
      ],
      type: account.type,
    });

  const authorization = {
    contractAddress,
    networkId,
    nonce,
  } as Authorization;

  if (typeof authorization.networkId === "undefined")
    authorization.networkId =
      client.chain?.id ??
      (await getAction(client, getNetworkId, "getNetworkId")({}));

  if (typeof authorization.nonce === "undefined") {
    authorization.nonce = await getAction(
      client,
      getTransactionCount,
      "getTransactionCount"
    )({
      address: account.address,
      blockTag: "pending",
    });
  }

  return account.experimental_signAuthorization(authorization);
}
