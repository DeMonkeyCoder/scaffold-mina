import type { Account } from "../../accounts/types";
import { parseAccount } from "../../accounts/utils/parseAccount";
import { getChainId } from "../../actions/public/getChainId";
import { prepareTransactionRequest } from "../../actions/wallet/prepareTransactionRequest";
import { sendRawTransaction } from "../../actions/wallet/sendRawTransaction";
import type {
  SendTransactionErrorType,
  SendTransactionParameters,
  SendTransactionRequest,
  SendTransactionReturnType,
} from "../../actions/wallet/sendTransaction";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import { AccountNotFoundError } from "../../errors/account";
import type { BaseError } from "../../errors/base";
import type { Chain } from "../../types/chain";
import { assertCurrentChain } from "../../utils/chain/assertCurrentChain";
import {
  type GetTransactionErrorParameters,
  getTransactionError,
} from "../../utils/errors/getTransactionError";
import { getAction } from "../../utils/getAction";
import type { ChainEIP712 } from "../types/chain";
import { assertEip712Request } from "../utils/assertEip712Request";
import { signTransaction } from "./signTransaction";

export type SendEip712TransactionParameters<
  chain extends ChainEIP712 | undefined = ChainEIP712 | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends ChainEIP712 | undefined = ChainEIP712 | undefined,
  request extends SendTransactionRequest<
    chain,
    chainOverride
  > = SendTransactionRequest<chain, chainOverride>
> = SendTransactionParameters<chain, account, chainOverride, request>;

export type SendEip712TransactionReturnType = SendTransactionReturnType;

export type SendEip712TransactionErrorType = SendTransactionErrorType;

/**
 * Creates, signs, and sends a new EIP712 transaction to the networkID.
 *
 * @param client - Client to use
 * @param parameters - {@link SendEip712TransactionParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { zksync } from 'viem/chains'
 * import { sendEip712Transaction } from 'viem/zksync'
 *
 * const client = createWalletClient({
 *   chain: zksync,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await sendEip712Transaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { zksync } from 'viem/chains'
 * import { sendEip712Transaction } from 'viem/zksync'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: zksync,
 *   transport: http(),
 * })
 *
 * const hash = await sendEip712Transaction(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
export async function sendEip712Transaction<
  chain extends ChainEIP712 | undefined,
  account extends Account | undefined,
  const request extends SendTransactionRequest<chain, chainOverride>,
  chainOverride extends ChainEIP712 | undefined = undefined
>(
  client: Client<Transport, chain, account>,
  parameters: SendEip712TransactionParameters<
    chain,
    account,
    chainOverride,
    request
  >
): Promise<SendEip712TransactionReturnType> {
  const { chain = client.chain } = parameters;

  if (!parameters.account)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/sendTransaction",
    });
  const account = parseAccount(parameters.account);

  try {
    assertEip712Request(parameters);

    // Prepare the request for signing (assign appropriate fees, etc.)
    const request = await prepareTransactionRequest(client, {
      ...parameters,
      parameters: ["gas", "nonce", "fees"],
    } as any);

    let chainId: number | undefined;
    if (chain !== null) {
      chainId = await getAction(client, getChainId, "getChainId")({});
      assertCurrentChain({
        currentChainId: chainId,
        chain,
      });
    }

    const serializedTransaction = await signTransaction(client, {
      ...request,
      chainId,
    } as any);

    return await getAction(
      client,
      sendRawTransaction,
      "sendRawTransaction"
    )({
      serializedTransaction,
    });
  } catch (err) {
    throw getTransactionError(err as BaseError, {
      ...(parameters as GetTransactionErrorParameters),
      account,
      chain: chain as Chain,
    });
  }
}
