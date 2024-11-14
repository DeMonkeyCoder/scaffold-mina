import { secp256k1 } from '@noble/curves/secp256k1'

import type { ErrorType } from '../../errors/utils'
import type { ByteArray, Hex, Signature } from '../../types/misc'
import { type HexToBigIntErrorType, hexToBigInt } from '../encoding/fromHex'
import { hexToBytes } from '../encoding/toBytes'
import type { ToHexErrorType } from '../encoding/toHex'

type To = 'bytes' | 'hex'

export type SerializeSignatureParameters<to extends To = 'hex'> = Signature & {
  to?: to | To | undefined
}

export type SerializeSignatureReturnType<to extends To = 'hex'> =
  | (to extends 'hex' ? Hex : never)
  | (to extends 'bytes' ? ByteArray : never)

export type SerializeSignatureErrorType =
  | HexToBigIntErrorType
  | ToHexErrorType
  | ErrorType

/**
 * @description Converts a signature into hex format.
 *
 * @param signature The signature to convert.
 * @returns The signature in hex format.
 *
 * @example
 * serializeSignature({
 *   r: '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf',
 *   s: '0x4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8',
 *   yParity: 1
 * })
 * // "0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c"
 */
export function serializeSignature<to extends To = 'hex'>({
  r,
  s,
  to = 'hex',
  v,
  yParity,
}: SerializeSignatureParameters<to>): SerializeSignatureReturnType<to> {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1) return yParity
    if (v && (v === 27n || v === 28n || v >= 35n)) return v % 2n === 0n ? 1 : 0
    throw new Error('Invalid `v` or `yParity` value')
  })()
  const signature = `0x${new secp256k1.Signature(
    hexToBigInt(r),
    hexToBigInt(s),
  ).toCompactHex()}${yParity_ === 0 ? '1b' : '1c'}` as const

  if (to === 'hex') return signature as SerializeSignatureReturnType<to>
  return hexToBytes(signature) as SerializeSignatureReturnType<to>
}
