import { presignMessagePrefix } from '../../constants/strings'
import type { ErrorType } from '../../errors/utils'
import type { Hex, SignableMessage } from '../../types/misc'
import { type ConcatErrorType, concat } from '../data/concat'
import { size } from '../data/size'
import {
  type BytesToHexErrorType,
  type StringToHexErrorType,
  bytesToHex,
  stringToHex,
} from '../encoding/toHex'

export type ToPrefixedMessageErrorType =
  | ConcatErrorType
  | StringToHexErrorType
  | BytesToHexErrorType
  | ErrorType

export function toPrefixedMessage(message_: SignableMessage): Hex {
  const message = (() => {
    if (typeof message_ === 'string') return stringToHex(message_)
    if (typeof message_.raw === 'string') return message_.raw
    return bytesToHex(message_.raw)
  })()
  const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`)
  return concat([prefix, message])
}
