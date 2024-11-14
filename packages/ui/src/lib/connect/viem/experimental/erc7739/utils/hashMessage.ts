import type { TypedDataDomain } from 'abitype'
import type { ErrorType } from '../../../errors/utils'
import type { Hex, SignableMessage } from '../../../types/misc'
import type { RequiredBy } from '../../../types/utils'
import { hashTypedData } from '../../../utils/index'
import type { HashTypedDataErrorType } from '../../../utils/signature/hashTypedData'
import {
  type ToPrefixedMessageErrorType,
  toPrefixedMessage,
} from '../../../utils/signature/toPrefixedMessage'

export type HashMessageParameters = {
  message: SignableMessage
  verifierDomain: RequiredBy<
    TypedDataDomain,
    'chainId' | 'name' | 'verifyingContract' | 'version'
  >
}

export type HashMessageReturnType = Hex

export type HashMessageErrorType =
  | HashTypedDataErrorType
  | ToPrefixedMessageErrorType
  | ErrorType

/**
 * Generates a signable hash for a ERC-7739 personal sign message.
 *
 * @example
 * ```ts
 * const hash = hashMessage({
 *   message: 'hello world',
 *   verifierDomain: {
 *     name: 'Smart Account',
 *     version: '1',
 *     verifyingContract: '0x1234567890abcdef1234567890abcdef12345678',
 *     chainId: 1,
 *   },
 * })
 * ```
 */
export function hashMessage(
  parameters: HashMessageParameters,
): HashMessageReturnType {
  const {
    message,
    verifierDomain: { salt, ...domain },
  } = parameters
  return hashTypedData({
    domain,
    types: {
      PersonalSign: [{ name: 'prefixed', type: 'bytes' }],
    },
    primaryType: 'PersonalSign',
    message: {
      prefixed: toPrefixedMessage(message),
    },
  })
}
