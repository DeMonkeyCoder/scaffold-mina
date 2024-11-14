import type { ErrorType } from '../../errors/utils'
import type { Hex, SignableMessage } from '../../types/misc'
import {
  type HashMessageErrorType,
  hashMessage,
} from '../../utils/signature/hashMessage'

import { type SignErrorType, sign } from './sign'

export type SignMessageParameters = {
  /** The message to sign. */
  message: SignableMessage
  /** The private key to sign with. */
  privateKey: Hex
}

export type SignMessageReturnType = Hex

export type SignMessageErrorType =
  | SignErrorType
  | HashMessageErrorType
  | ErrorType

/**
 * @description Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191):
 * `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * @returns The signature.
 */
export async function signMessage({
  message,
  privateKey,
}: SignMessageParameters): Promise<SignMessageReturnType> {
  return await sign({ hash: hashMessage(message), privateKey, to: 'hex' })
}
