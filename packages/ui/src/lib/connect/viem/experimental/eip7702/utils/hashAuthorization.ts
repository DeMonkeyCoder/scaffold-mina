import type { ErrorType } from '../../../errors/utils'
import type { ByteArray, Hex } from '../../../types/misc'
import {
  type ConcatHexErrorType,
  concatHex,
} from '../../../utils/data/concat'
import {
  type HexToBytesErrorType,
  hexToBytes,
} from '../../../utils/encoding/toBytes'
import {
  type NumberToHexErrorType,
  numberToHex,
} from '../../../utils/encoding/toHex'
import { type ToRlpErrorType, toRlp } from '../../../utils/encoding/toRlp'
import {
  type Keccak256ErrorType,
  keccak256,
} from '../../../utils/hash/keccak256'
import type { Authorization } from '../types/authorization'

type To = 'hex' | 'bytes'

export type HashAuthorizationParameters<to extends To> = Authorization & {
  /** Output format. @default "hex" */
  to?: to | To | undefined
}

export type HashAuthorizationReturnType<to extends To> =
  | (to extends 'bytes' ? ByteArray : never)
  | (to extends 'hex' ? Hex : never)

export type HashAuthorizationErrorType =
  | Keccak256ErrorType
  | ConcatHexErrorType
  | ToRlpErrorType
  | NumberToHexErrorType
  | HexToBytesErrorType
  | ErrorType

/**
 * Computes an Authorization hash in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
 */
export function hashAuthorization<to extends To = 'hex'>(
  parameters: HashAuthorizationParameters<to>,
): HashAuthorizationReturnType<to> {
  const { chainId, contractAddress, nonce, to } = parameters
  const hash = keccak256(
    concatHex([
      '0x05',
      toRlp([
        numberToHex(chainId),
        contractAddress,
        [nonce ? numberToHex(nonce) : '0x'],
      ]),
    ]),
  )
  if (to === 'bytes') return hexToBytes(hash) as HashAuthorizationReturnType<to>
  return hash as HashAuthorizationReturnType<to>
}
