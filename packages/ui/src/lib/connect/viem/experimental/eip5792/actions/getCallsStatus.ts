import type { Client } from '../../../clients/createClient'
import type { Transport } from '../../../clients/transports/createTransport'
import type { ErrorType } from '../../../errors/utils'
import type { Account } from '../../../types/account'
import type { Chain } from '../../../types/chain'
import type { WalletGetCallsStatusReturnType } from '../../../types/eip1193'
import type { Prettify } from '../../../types/utils'
import type { RequestErrorType } from '../../../utils/buildRequest'
import { hexToBigInt } from '../../../utils/encoding/fromHex'
import { receiptStatuses } from '../../../utils/formatters/transactionReceipt'

export type GetCallsStatusParameters = { id: string }

export type GetCallsStatusReturnType = Prettify<
  WalletGetCallsStatusReturnType<bigint, 'success' | 'reverted'>
>

export type GetCallsStatusErrorType = RequestErrorType | ErrorType

/**
 * Returns the status of a call batch that was sent via `sendCalls`.
 *
 * - Docs: https://viem.sh/experimental/eip5792/getCallsStatus
 * - JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
 *
 * @param client - Client to use
 * @returns Status of the calls. {@link GetCallsStatusReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getCallsStatus } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const { receipts, status } = await getCallsStatus(client, { id: '0xdeadbeef' })
 */
export async function getCallsStatus<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: GetCallsStatusParameters,
): Promise<GetCallsStatusReturnType> {
  const { id } = parameters
  const { receipts, status } = await client.request({
    method: 'wallet_getCallsStatus',
    params: [id],
  })
  return {
    status,
    receipts:
      receipts?.map((receipt) => ({
        ...receipt,
        blockNumber: hexToBigInt(receipt.blockNumber),
        gasUsed: hexToBigInt(receipt.gasUsed),
        status: receiptStatuses[receipt.status as '0x0' | '0x1'],
      })) ?? [],
  }
}
