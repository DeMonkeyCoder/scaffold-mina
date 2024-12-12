import { Address } from '@/lib/connect/viem'
import type { ErrorType } from '../../errors/utils'
import { LruMap } from '../lru'
import bs58 from 'bs58'
import { sha256 } from '@noble/hashes/sha256'

export function validateAddressChecksum(address_: Address): boolean {
  const decoded = bs58.decode(address_)
  const addressChecksum = decoded.slice(-4)
  const payload = decoded.slice(0, -4)
  const calculatedChecksum = sha256(sha256(payload)).slice(0, 4)
  return Buffer.compare(addressChecksum, calculatedChecksum) === 0
}

export type IsAddressErrorType = ChecksumAddressErrorType | ErrorType

const addressRegex = /^B62[a-zA-Z0-9]{52}$/

/** @internal */
export const isAddressCache = /*#__PURE__*/ new LruMap<boolean>(8192)

export type IsAddressOptions = {
  /**
   * Enables strict mode. Whether or not to compare the address against its checksum.
   *
   * @default true
   */
  strict?: boolean | undefined
}

export type ChecksumAddressErrorType = ErrorType

export function isAddress(
  address: string,
  options?: IsAddressOptions | undefined,
): address is Address {
  const { strict = true } = options ?? {}
  const cacheKey = `${address}.${strict}`

  if (isAddressCache.has(cacheKey)) return isAddressCache.get(cacheKey)!

  const result = (() => {
    if (!addressRegex.test(address)) return false
    if (strict) return validateAddressChecksum(address as Address)
    return true
  })()
  isAddressCache.set(cacheKey, result)
  return result
}
