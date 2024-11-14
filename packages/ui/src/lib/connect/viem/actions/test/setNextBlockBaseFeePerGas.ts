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

export type SetNextBlockBaseFeePerGasParameters = {
  /** Base fee per gas (in wei). */
  baseFeePerGas: bigint
}

export type SetNextBlockBaseFeePerGasErrorType = RequestErrorType | ErrorType

/**
 * Sets the next block's base fee per gas.
 *
 * - Docs: https://viem.sh/docs/actions/test/setNextBlockBaseFeePerGas
 *
 * @param client - Client to use
 * @param parameters – {@link SetNextBlockBaseFeePerGasParameters}
 *
 * @example
 * import { createTestClient, http, parseGwei } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setNextBlockBaseFeePerGas } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setNextBlockBaseFeePerGas(client, {
 *   baseFeePerGas: parseGwei('20'),
 * })
 */
export async function setNextBlockBaseFeePerGas<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { baseFeePerGas }: SetNextBlockBaseFeePerGasParameters,
) {
  await client.request({
    method: `${client.mode}_setNextBlockBaseFeePerGas`,
    params: [numberToHex(baseFeePerGas)],
  })
}
