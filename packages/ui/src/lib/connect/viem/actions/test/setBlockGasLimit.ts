import type {
  TestClient,
  TestClientMode,
} from '../../clients/createTestClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Account } from '../../types/account'
import type { Chain } from '../../types/chain'
import type { RequestErrorType } from '../../utils/buildRequest'
import { numberToHex } from '../../utils/encoding/toHex'

export type SetBlockGasLimitParameters = {
  /** Gas limit (in wei). */
  gasLimit: bigint
}

export type SetBlockGasLimitErrorType = RequestErrorType | ErrorType

/**
 * Sets the block's gas limit.
 *
 * - Docs: https://viem.sh/docs/actions/test/setBlockGasLimit
 *
 * @param client - Client to use
 * @param parameters – {@link SetBlockGasLimitParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setBlockGasLimit } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setBlockGasLimit(client, { gasLimit: 420_000n })
 */
export async function setBlockGasLimit<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { gasLimit }: SetBlockGasLimitParameters,
) {
  await client.request({
    method: 'evm_setBlockGasLimit',
    params: [numberToHex(gasLimit)],
  })
}
