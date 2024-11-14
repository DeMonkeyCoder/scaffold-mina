import type { ErrorType } from '../../errors/utils'
import type { Hex } from '../../types/misc'
import { type IsHexErrorType, isHex } from '../data/isHex'
import { type SizeErrorType, size } from '../data/size'

export type IsHashErrorType = IsHexErrorType | SizeErrorType | ErrorType

export function isHash(hash: string): hash is Hex {
  return isHex(hash) && size(hash) === 32
}
