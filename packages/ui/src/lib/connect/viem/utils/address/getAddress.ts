import type { Address } from "@/lib/connect/viem";

import { InvalidAddressError } from "../../errors/address";
import type { ErrorType } from "../../errors/utils";
import {
  stringToBytes,
  type StringToBytesErrorType,
} from "../encoding/toBytes";
import { keccak256, type Keccak256ErrorType } from "../hash/keccak256";
import { LruMap } from "../lru";
import { isAddress, type IsAddressErrorType } from "./isAddress";

const checksumAddressCache = /*#__PURE__*/ new LruMap<Address>(8192);

export type ChecksumAddressErrorType =
  | Keccak256ErrorType
  | StringToBytesErrorType
  | ErrorType;

export function checksumAddress(
  address_: Address,
  /**
   * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
   * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
   * that relies on EIP-55 checksum encoding (checksum without chainId).
   *
   * It is highly recommended to not use this feature unless you
   * know what you are doing.
   *
   * See more: https://github.com/ethereum/EIPs/issues/1121
   */
  chainId?: number | undefined
): Address {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`)!;

  const hexAddress = chainId
    ? `${chainId}${address_.toLowerCase()}`
    : address_.substring(2).toLowerCase();
  const hash = keccak256(stringToBytes(hexAddress), "bytes");

  const address = (
    chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress
  ).split("");
  for (let i = 0; i < 40; i += 2) {
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }

  const result = `0x${address.join("")}` as const;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
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
   * that relies on EIP-55 checksum encoding (checksum without chainId).
   *
   * It is highly recommended to not use this feature unless you
   * know what you are doing.
   *
   * See more: https://github.com/ethereum/EIPs/issues/1121
   */
  chainId?: number
): Address {
  if (!isAddress(address, { strict: false }))
    throw new InvalidAddressError({ address });
  return checksumAddress(address, chainId);
}
