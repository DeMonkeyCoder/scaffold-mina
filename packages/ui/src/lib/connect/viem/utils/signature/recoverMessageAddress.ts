import type { Address } from 'abitype'

import type {
  ByteArray,
  Hex,
  SignableMessage,
  Signature,
} from '../../types/misc'

import type { ErrorType } from '../../errors/utils'
import { type HashMessageErrorType, hashMessage } from './hashMessage'
import {
  type RecoverAddressErrorType,
  recoverAddress,
} from './recoverAddress'

export type RecoverMessageAddressParameters = {
  message: SignableMessage
  signature: Hex | ByteArray | Signature
}

export type RecoverMessageAddressReturnType = Address

export type RecoverMessageAddressErrorType =
  | HashMessageErrorType
  | RecoverAddressErrorType
  | ErrorType

export async function recoverMessageAddress({
  message,
  signature,
}: RecoverMessageAddressParameters): Promise<RecoverMessageAddressReturnType> {
  return recoverAddress({ hash: hashMessage(message), signature })
}
