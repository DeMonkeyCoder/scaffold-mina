import {
  InvalidAddressError,
  type InvalidAddressErrorType,
} from '../../errors/address'
import {
  InvalidStorageKeySizeError,
  type InvalidStorageKeySizeErrorType,
} from '../../errors/transaction'
import type { ErrorType } from '../../errors/utils'
import type { Hex } from '../../types/misc'
import type { AccessList } from '../../types/transaction'
import { type IsAddressErrorType, isAddress } from '../address/isAddress'
import type { RecursiveArray } from '../encoding/toRlp'

export type SerializeAccessListErrorType =
  | InvalidStorageKeySizeErrorType
  | InvalidAddressErrorType
  | IsAddressErrorType
  | ErrorType

/*
 * Serialize an  EIP-2930 access list
 * @remarks
 * Use to create a transaction serializer with support for EIP-2930 access lists
 *
 * @param accessList - Array of objects of address and arrays of Storage Keys
 * @throws InvalidAddressError, InvalidStorageKeySizeError
 * @returns Array of hex strings
 */
export function serializeAccessList(
  accessList?: AccessList | undefined,
): RecursiveArray<Hex> {
  if (!accessList || accessList.length === 0) return []

  const serializedAccessList = []
  for (let i = 0; i < accessList.length; i++) {
    const { address, storageKeys } = accessList[i]

    for (let j = 0; j < storageKeys.length; j++) {
      if (storageKeys[j].length - 2 !== 64) {
        throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] })
      }
    }

    if (!isAddress(address, { strict: false })) {
      throw new InvalidAddressError({ address })
    }

    serializedAccessList.push([address, storageKeys])
  }
  return serializedAccessList
}
