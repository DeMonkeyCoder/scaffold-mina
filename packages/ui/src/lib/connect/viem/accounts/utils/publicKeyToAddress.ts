import type { Address } from "@/lib/connect/viem";

import type { ErrorType } from "../../errors/utils";
import type { Hex } from "../../types/misc";
import {
  type ChecksumAddressErrorType,
  checksumAddress,
} from "../../utils/address/getAddress";
import { type Keccak256ErrorType, keccak256 } from "../../utils/hash/keccak256";

export type PublicKeyToAddressErrorType =
  | ChecksumAddressErrorType
  | Keccak256ErrorType
  | ErrorType;

/**
 * @description Converts an ECDSA public key to an address.
 *
 * @param publicKey The public key to convert.
 *
 * @returns The address.
 */
export function publicKeyToAddress(publicKey: Hex): Address {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`) as Address;
}
