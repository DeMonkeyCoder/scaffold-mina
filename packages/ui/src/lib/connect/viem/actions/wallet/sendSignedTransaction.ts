import type {Client} from '../../clients/createClient'
import type {Transport} from '../../clients/transports/createTransport'
import type {ErrorType} from '../../errors/utils'
import type {Chain} from '../../types/chain'
import type {Hash} from '../../types/misc'
import type {TransactionRequestSigned} from '../../types/transaction'
import type {RequestErrorType} from '../../utils/buildRequest'

export type SendSignedTransactionParameters = TransactionRequestSigned

export type SendSignedTransactionReturnType = Hash

export type SendSignedTransactionErrorType = RequestErrorType | ErrorType

/**
 * Sends a **signed** transaction to the network
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendSignedTransaction
 * - JSON-RPC Method: [`eth_sendSignedTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param client - Client to use
 * @param parameters - {@link SendSignedTransactionParameters}
 * @returns The transaction hash. {@link SendSignedTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendSignedTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 *
 * const hash = await sendSignedTransaction(client, {
 *   signedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
 * })
 */
export async function sendSignedTransaction<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: SendSignedTransactionParameters,
): Promise<SendSignedTransactionReturnType> {
  const { type, ...rest } = parameters
  return client.request(
    {
      // @ts-ignore
      method: 'mina_sendTransaction',
      // @ts-ignore
      params: [rest, type],
    },
    { retryCount: 0 },
  )
}
