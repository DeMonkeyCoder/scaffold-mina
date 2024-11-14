import { equalBytes } from '@noble/curves/abstract/utils'

import type { ErrorType } from '../../errors/utils'
import type { ByteArray, Hex } from '../../types/misc'
import { type ToBytesErrorType, toBytes } from '../encoding/toBytes'
import { type IsHexErrorType, isHex } from './isHex'

export type IsBytesEqualErrorType =
  | IsHexErrorType
  | ToBytesErrorType
  | ErrorType

export function isBytesEqual(a_: ByteArray | Hex, b_: ByteArray | Hex) {
  const a = isHex(a_) ? toBytes(a_) : a_
  const b = isHex(b_) ? toBytes(b_) : b_
  return equalBytes(a, b)
}
