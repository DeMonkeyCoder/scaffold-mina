import { secp256k1 } from '@noble/curves/secp256k1'

import type { ErrorType } from '../errors/utils'
import type { Hex } from '../types/misc'
import { type ToHexErrorType, toHex } from '../utils/encoding/toHex'

export type GeneratePrivateKeyErrorType = ToHexErrorType | ErrorType

/**
 * @description Generates a random private key.
 *
 * @returns A randomly generated private key.
 */
export function generatePrivateKey(): Hex {
  return toHex(secp256k1.utils.randomPrivateKey())
}
