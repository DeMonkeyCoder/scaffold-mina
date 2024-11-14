import type { AbiFunction } from 'abitype'

import type { ErrorType } from '../../errors/utils'
import { type SliceErrorType, slice } from '../data/slice'
import {
  type ToSignatureHashErrorType,
  toSignatureHash,
} from './toSignatureHash'

export type ToFunctionSelectorErrorType =
  | ToSignatureHashErrorType
  | SliceErrorType
  | ErrorType

/**
 * Returns the function selector for a given function definition.
 *
 * @example
 * const selector = toFunctionSelector('function ownerOf(uint256 tokenId)')
 * // 0x6352211e
 */
export const toFunctionSelector = (fn: string | AbiFunction) =>
  slice(toSignatureHash(fn), 0, 4)
