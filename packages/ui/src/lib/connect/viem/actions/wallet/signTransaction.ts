import type { Account } from "../../accounts/types";
import {
  parseAccount,
  type ParseAccountErrorType,
} from "../../accounts/utils/parseAccount";
import type { SignTransactionErrorType as SignTransactionErrorType_account } from "../../accounts/utils/signTransaction";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import { AccountNotFoundError } from "../../errors/account";
import type { ErrorType } from "../../errors/utils";
import type { GetAccountParameter } from "../../types/account";
import type { Chain, DeriveChain, GetChainParameter } from "../../types/chain";
import type { GetTransactionRequestKzgParameter } from "../../types/kzg";
import type { RpcTransactionRequest } from "../../types/rpc";
import type {
  TransactionRequest,
  TransactionSerializable,
  TransactionSerialized,
} from "../../types/transaction";
import type { UnionOmit } from "../../types/utils";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  assertCurrentChain,
  type AssertCurrentChainErrorType,
} from "../../utils/chain/assertCurrentChain";
import type { NumberToHexErrorType } from "../../utils/encoding/toHex";
import {
  type FormattedTransactionRequest,
  formatTransactionRequest,
} from "../../utils/formatters/transactionRequest";
import { getAction } from "../../utils/getAction";
import {
  assertRequest,
  type AssertRequestErrorType,
} from "../../utils/transaction/assertRequest";
import { getChainId, type GetChainIdErrorType } from "../public/getChainId";

type SignTransactionRequest<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  ///
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>
> = UnionOmit<FormattedTransactionRequest<_derivedChain>, "from">;

export type SignTransactionParameters<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  request extends SignTransactionRequest<
    chain,
    chainOverride
  > = SignTransactionRequest<chain, chainOverride>
> = request &
  GetAccountParameter<account> &
  GetChainParameter<chain, chainOverride> &
  GetTransactionRequestKzgParameter<request>;

export type SignTransactionReturnType = TransactionSerialized;

export type SignTransactionErrorType =
  | ParseAccountErrorType
  | AssertRequestErrorType
  | GetChainIdErrorType
  | AssertCurrentChainErrorType
  | SignTransactionErrorType_account
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType;

/**
 * Signs a transaction.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signTransaction
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`mina_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * @param args - {@link SignTransactionParameters}
 * @returns The signed serialized transaction. {@link SignTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 */
export async function signTransaction<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
  const request extends SignTransactionRequest<
    chain,
    chainOverride
  > = SignTransactionRequest<chain, chainOverride>
>(
  client: Client<Transport, chain, account>,
  parameters: SignTransactionParameters<chain, account, chainOverride, request>
): Promise<SignTransactionReturnType> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    ...transaction
  } = parameters;

  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signTransaction",
    });
  const account = parseAccount(account_);

  assertRequest({
    account,
    ...parameters,
  });

  const chainId = await getAction(client, getChainId, "getChainId")({});
  if (chain !== null)
    assertCurrentChain({
      currentChainId: chainId,
      chain,
    });

  const formatters = chain?.formatters || client.chain?.formatters;
  const format =
    formatters?.transactionRequest?.format || formatTransactionRequest;

  if (account.signTransaction)
    return account.signTransaction(
      {
        ...transaction,
        chainId,
      } as TransactionSerializable,
      { serializer: client.chain?.serializers?.transaction }
    ) as Promise<SignTransactionReturnType>;

  return await client.request(
    {
      method: "mina_signTransaction",
      params: [
        {
          ...format(transaction as unknown as TransactionRequest),
          chainId,
          from: account.address,
        } as unknown as RpcTransactionRequest,
      ],
    },
    { retryCount: 0 }
  );
}
