import type { Address } from 'abitype'

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

export type SetNonceParameters = {
  /** The account address. */
  address: Address
  /** The nonce to set. */
  nonce: number
}

export type SetNonceErrorType = RequestErrorType | ErrorType

/**
 * Modifies (overrides) the nonce of an account.
 *
 * - Docs: https://viem.sh/docs/actions/test/setNonce
 *
 * @param client - Client to use
 * @param parameters – {@link SetNonceParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setNonce } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setNonce(client, {
 *   address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 *   nonce: 420,
 * })
 */
export async function setNonce<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: TestClient<TestClientMode, Transport, chain, account, false>,
  { address, nonce }: SetNonceParameters,
) {
  await client.request({
    method: `${client.mode}_setNonce`,
    params: [address, numberToHex(nonce)],
  })
}
