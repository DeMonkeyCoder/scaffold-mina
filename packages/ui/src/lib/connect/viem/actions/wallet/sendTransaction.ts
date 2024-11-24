import type { Account } from "../../accounts/types";
import {
  parseAccount,
  type ParseAccountErrorType,
} from "../../accounts/utils/parseAccount";
import type { SignTransactionErrorType } from "../../accounts/utils/signTransaction";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import {
  AccountNotFoundError,
  type AccountNotFoundErrorType,
  AccountTypeNotSupportedError,
  type AccountTypeNotSupportedErrorType,
} from "../../errors/account";
import { BaseError } from "../../errors/base";
import type { ErrorType } from "../../errors/utils";
import {
  recoverAuthorizationAddress,
  type RecoverAuthorizationAddressErrorType,
} from "../../experimental/eip7702/utils/recoverAuthorizationAddress";
import type { GetAccountParameter } from "../../types/account";
import type { Chain, DeriveChain, GetChainParameter } from "../../types/chain";
import type { GetTransactionRequestKzgParameter } from "../../types/kzg";
import type { Hash } from "../../types/misc";
import type { TransactionRequest } from "../../types/transaction";
import type { UnionOmit } from "../../types/utils";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  assertCurrentChain,
  type AssertCurrentChainErrorType,
} from "../../utils/chain/assertCurrentChain";
import {
  getTransactionError,
  type GetTransactionErrorReturnType,
} from "../../utils/errors/getTransactionError";
import { extract } from "../../utils/formatters/extract";
import {
  type FormattedTransactionRequest,
  formatTransactionRequest,
} from "../../utils/formatters/transactionRequest";
import { getAction } from "../../utils/getAction";
import {
  assertRequest,
  type AssertRequestErrorType,
  type AssertRequestParameters,
} from "../../utils/transaction/assertRequest";
import { getChainId, type GetChainIdErrorType } from "../public/getChainId";
import {
  defaultParameters,
  prepareTransactionRequest,
  type PrepareTransactionRequestErrorType,
} from "./prepareTransactionRequest";
import {
  sendRawTransaction,
  type SendRawTransactionErrorType,
} from "./sendRawTransaction";

export type SendTransactionRequest<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  ///
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>
> = UnionOmit<FormattedTransactionRequest<_derivedChain>, "from"> &
  GetTransactionRequestKzgParameter;

export type SendTransactionParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  request extends SendTransactionRequest<
    chain,
    chainOverride
  > = SendTransactionRequest<chain, chainOverride>
> = request &
  GetAccountParameter<account> &
  GetChainParameter<chain, chainOverride> &
  GetTransactionRequestKzgParameter<request>;

export type SendTransactionReturnType = Hash;

export type SendTransactionErrorType =
  | ParseAccountErrorType
  | GetTransactionErrorReturnType<
      | AccountNotFoundErrorType
      | AccountTypeNotSupportedErrorType
      | AssertCurrentChainErrorType
      | AssertRequestErrorType
      | GetChainIdErrorType
      | PrepareTransactionRequestErrorType
      | SendRawTransactionErrorType
      | RecoverAuthorizationAddressErrorType
      | SignTransactionErrorType
      | RequestErrorType
    >
  | ErrorType;

/**
 * Creates, signs, and sends a new transaction to the networkID.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendTransaction
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/sending-transactions
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`mina_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_sendtransaction)
 *   - Local Accounts: [`mina_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_sendrawtransaction)
 *
 * @param client - Client to use
 * @param parameters - {@link SendTransactionParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await sendTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await sendTransaction(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
export async function sendTransaction<
  chain extends Chain | undefined,
  account extends Account | undefined,
  const request extends SendTransactionRequest<chain, chainOverride>,
  chainOverride extends Chain | undefined = undefined
>(
  client: Client<Transport, chain, account>,
  parameters: SendTransactionParameters<chain, account, chainOverride, request>
): Promise<SendTransactionReturnType> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    accessList,
    authorizationList,
    blobs,
    data,
    gas,
    gasPrice,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    value,
    ...rest
  } = parameters;

  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/sendTransaction",
    });
  const account = parseAccount(account_);

  try {
    assertRequest(parameters as AssertRequestParameters);

    let chainId: string | undefined;
    if (chain !== null) {
      chainId = await getAction(client, getChainId, "getChainId")({});
      assertCurrentChain({
        currentChainId: chainId,
        chain,
      });
    }

    const to = await (async () => {
      // If `to` exists on the parameters, use that.
      if (parameters.to) return parameters.to;

      // If no `to` exists, and we are sending a EIP-7702 transaction, use the
      // address of the first authorization in the list.
      if (authorizationList && authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: authorizationList[0],
        }).catch(() => {
          throw new BaseError(
            "`to` is required. Could not infer from `authorizationList`."
          );
        });

      // Otherwise, we are sending a deployment transaction.
      return undefined;
    })();

    if (account.type === "json-rpc") {
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;

      const request = format({
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
        accessList,
        authorizationList,
        blobs,
        chainId,
        data,
        from: account.address,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value,
      } as TransactionRequest);
      return await client.request(
        {
          method: "mina_sendTransaction",
          params: [request],
        },
        { retryCount: 0 }
      );
    }

    if (account.type === "local") {
      // Prepare the request for signing (assign appropriate fees, etc.)
      const request = await getAction(
        client,
        prepareTransactionRequest,
        "prepareTransactionRequest"
      )({
        account,
        accessList,
        authorizationList,
        blobs,
        chain,
        chainId,
        data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        parameters: [...defaultParameters, "sidecars"],
        value,
        ...rest,
        to,
      } as any);

      const serializer = chain?.serializers?.transaction;
      const serializedTransaction = (await account.signTransaction(request, {
        serializer,
      })) as Hash;
      return await getAction(
        client,
        sendRawTransaction,
        "sendRawTransaction"
      )({
        serializedTransaction,
      });
    }

    throw new AccountTypeNotSupportedError({
      docsPath: "/docs/actions/wallet/sendTransaction",
      type: (account as { type: string }).type,
    });
  } catch (err) {
    if (err instanceof AccountTypeNotSupportedError) throw err;
    throw getTransactionError(err as BaseError, {
      ...parameters,
      account,
      chain: parameters.chain || undefined,
    });
  }
}
