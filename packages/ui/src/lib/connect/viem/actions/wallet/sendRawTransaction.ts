import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { Hash } from "../../types/misc";
import type { TransactionSerializedGeneric } from "../../types/transaction";
import type { RequestErrorType } from "../../utils/buildRequest";

export type SendRawTransactionParameters = {
  /** The signed serialized transaction. */
  serializedTransaction: TransactionSerializedGeneric;
};

export type SendRawTransactionReturnType = Hash;

export type SendRawTransactionErrorType = RequestErrorType | ErrorType;

/**
 * Sends a **signed** transaction to the networkID
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
 * - JSON-RPC Method: [`mina_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param client - Client to use
 * @param parameters - {@link SendRawTransactionParameters}
 * @returns The transaction hash. {@link SendRawTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendRawTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 *
 * const hash = await sendRawTransaction(client, {
 *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
 * })
 */
export async function sendRawTransaction<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  { serializedTransaction }: SendRawTransactionParameters
): Promise<SendRawTransactionReturnType> {
  return client.request(
    {
      method: "mina_sendRawTransaction",
      params: [serializedTransaction],
    },
    { retryCount: 0 }
  );
}
