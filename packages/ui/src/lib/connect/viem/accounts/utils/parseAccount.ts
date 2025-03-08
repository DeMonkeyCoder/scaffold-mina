import type { Address } from '@/lib/connect/viem'

import type { ErrorType } from '../../errors/utils'
import type { Account } from '../types'

export type ParseAccountErrorType = ErrorType

export function parseAccount<accountOrAddress extends Address | Account>(
  account: accountOrAddress,
): accountOrAddress extends Address ? Account : accountOrAddress {
  if (typeof account === 'string')
    return { address: account, type: 'json-rpc' } as any
  return account as any
}
