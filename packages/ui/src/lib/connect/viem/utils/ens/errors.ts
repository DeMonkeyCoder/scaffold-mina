import { panicReasons } from '../../constants/solidity'
import { BaseError } from '../../errors/base'
import { ContractFunctionRevertedError } from '../../errors/contract'
import type { ErrorType } from '../../errors/utils'

/** @internal */
export type IsNullUniversalResolverErrorErrorType = ErrorType

/*
 * @description Checks if error is a valid null result UniversalResolver error
 */
export function isNullUniversalResolverError(
  err: unknown,
  callType: 'resolve' | 'reverse',
): boolean {
  if (!(err instanceof BaseError)) return false
  const cause = err.walk((e) => e instanceof ContractFunctionRevertedError)
  if (!(cause instanceof ContractFunctionRevertedError)) return false
  if (cause.data?.errorName === 'ResolverNotFound') return true
  if (cause.data?.errorName === 'ResolverWildcardNotSupported') return true
  if (cause.data?.errorName === 'ResolverNotContract') return true
  if (cause.data?.errorName === 'ResolverError') return true
  if (cause.data?.errorName === 'HttpError') return true
  // Backwards compatibility for older UniversalResolver contracts
  if (
    cause.reason?.includes(
      'Wildcard on non-extended resolvers is not supported',
    )
  )
    return true
  // No primary name set for address.
  if (callType === 'reverse' && cause.reason === panicReasons[50]) return true
  return false
}
