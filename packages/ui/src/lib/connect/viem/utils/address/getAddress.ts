import type { Address } from "@/lib/connect/viem";
import type { ErrorType } from "../../errors/utils";
import { type Keccak256ErrorType } from "../hash/keccak256";
import { LruMap } from "../lru";
import { type IsAddressErrorType } from "./isAddress";

const checksumAddressCache = /*#__PURE__*/ new LruMap<Address>(8192);

export type ChecksumAddressErrorType = Keccak256ErrorType | ErrorType;

export function checksumAddress(
  address_: Address,
  /**
   * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
   * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
   * that relies on EIP-55 checksum encoding (checksum without networkId).
   *
   * It is highly recommended to not use this feature unless you
   * know what you are doing.
   *
   * See more: https://github.com/ethereum/EIPs/issues/1121
   */
  networkId?: string | undefined
): Address {
  if (checksumAddressCache.has(`${address_}.${networkId}`))
    return checksumAddressCache.get(`${address_}.${networkId}`)!;

  // TODO: implement address checksum

  checksumAddressCache.set(`${address_}.${networkId}`, address_);
  return address_;
}

export type GetAddressErrorType =
  | ChecksumAddressErrorType
  | IsAddressErrorType
  | ErrorType;

export function getAddress(
  address: string,
  /**
   * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
   * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
   * that relies on EIP-55 checksum encoding (checksum without networkId).
   *
   * It is highly recommended to not use this feature unless you
   * know what you are doing.
   *
   * See more: https://github.com/ethereum/EIPs/issues/1121
   */
  networkId?: string
): Address {
  // if (!isAddress(address, { strict: false }))
  //   throw new InvalidAddressError({ address });
  // return checksumAddress(address, networkId);
  return address;
}
