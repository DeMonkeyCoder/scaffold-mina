import type { ErrorType } from '../../errors/utils'
import type { Hex } from '../../types/misc'

export type EncodeLabelhashErrorType = ErrorType

export function encodeLabelhash(hash: Hex): `[${string}]` {
  return `[${hash.slice(2)}]`
}
