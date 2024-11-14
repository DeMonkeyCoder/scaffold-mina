import { secp256k1 } from '@noble/curves/secp256k1'
import type { Address } from 'abitype'

import type { ErrorType } from '../../errors/utils'
import type { Hex } from '../../types/misc'
import {
  type BytesToHexErrorType,
  bytesToHex,
} from '../../utils/encoding/toHex'
import {
  type PublicKeyToAddressErrorType,
  publicKeyToAddress,
} from './publicKeyToAddress'

export type PrivateKeyToAddressErrorType =
  | BytesToHexErrorType
  | PublicKeyToAddressErrorType
  | ErrorType

/**
 * @description Converts an ECDSA private key to an address.
 *
 * @param privateKey The private key to convert.
 *
 * @returns The address.
 */
export function privateKeyToAddress(privateKey: Hex): Address {
  const publicKey = bytesToHex(
    secp256k1.getPublicKey(privateKey.slice(2), false),
  )
  return publicKeyToAddress(publicKey)
}
