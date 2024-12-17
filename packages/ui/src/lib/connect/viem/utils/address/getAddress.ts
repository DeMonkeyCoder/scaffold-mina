import {
  type Address,
  InvalidAddressError,
  isAddress,
} from '@/lib/connect/viem'
import type { ErrorType } from '../../errors/utils'
import type { IsAddressErrorType } from './isAddress'

export type GetAddressErrorType = IsAddressErrorType | ErrorType

export function getAddress(address: string): Address {
  if (!isAddress(address, { strict: false }))
    throw new InvalidAddressError({ address })
  return address
}
