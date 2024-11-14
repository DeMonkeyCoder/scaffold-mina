import type { Address } from 'abitype'

import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Chain } from '../../types/chain'
import type {
  ByteArray,
  Hex,
  SignableMessage,
  Signature,
} from '../../types/misc'
import type { Prettify } from '../../types/utils'
import { hashMessage } from '../../utils/signature/hashMessage'
import type { HashMessageErrorType } from '../../utils/signature/hashMessage'
import {
  type VerifyHashErrorType,
  type VerifyHashParameters,
  verifyHash,
} from './verifyHash'

export type VerifyMessageParameters = Prettify<
  Omit<VerifyHashParameters, 'hash'> & {
    /** The address that signed the original message. */
    address: Address
    /** The message to be verified. */
    message: SignableMessage
    /** The signature that was generated by signing the message with the address's private key. */
    signature: Hex | ByteArray | Signature
  }
>

export type VerifyMessageReturnType = boolean

export type VerifyMessageErrorType =
  | HashMessageErrorType
  | VerifyHashErrorType
  | ErrorType

/**
 * Verify that a message was signed by the provided address.
 *
 * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
 *
 * - Docs {@link https://viem.sh/docs/actions/public/verifyMessage}
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyMessageParameters}
 * @returns Whether or not the signature is valid. {@link VerifyMessageReturnType}
 */
export async function verifyMessage<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  {
    address,
    message,
    factory,
    factoryData,
    signature,
    ...callRequest
  }: VerifyMessageParameters,
): Promise<VerifyMessageReturnType> {
  const hash = hashMessage(message)
  return verifyHash(client, {
    address,
    factory: factory!,
    factoryData: factoryData!,
    hash,
    signature,
    ...callRequest,
  })
}
