import { BaseError, type BaseErrorType } from '../../errors/base'
import {
  InvalidHexValueError,
  type InvalidHexValueErrorType,
} from '../../errors/encoding'
import type { ErrorType } from '../../errors/utils'
import type { ByteArray, Hex } from '../../types/misc'
import {
  type CreateCursorErrorType,
  type Cursor,
  createCursor,
} from '../cursor'
import { type HexToBytesErrorType, hexToBytes } from './toBytes'
import { type BytesToHexErrorType, bytesToHex } from './toHex'

import type { RecursiveArray } from './toRlp'

type To = 'hex' | 'bytes'

export type FromRlpReturnType<to extends To> =
  | (to extends 'bytes' ? RecursiveArray<ByteArray> : never)
  | (to extends 'hex' ? RecursiveArray<Hex> : never)

export type FromRlpErrorType =
  | CreateCursorErrorType
  | FromRlpCursorErrorType
  | HexToBytesErrorType
  | InvalidHexValueErrorType
  | ErrorType

export function fromRlp<to extends To = 'hex'>(
  value: ByteArray | Hex,
  to: to | To | undefined = 'hex',
): FromRlpReturnType<to> {
  const bytes = (() => {
    if (typeof value === 'string') {
      if (value.length > 3 && value.length % 2 !== 0)
        throw new InvalidHexValueError(value)
      return hexToBytes(value)
    }
    return value
  })()

  const cursor = createCursor(bytes, {
    recursiveReadLimit: Number.POSITIVE_INFINITY,
  })
  const result = fromRlpCursor(cursor, to)

  return result as FromRlpReturnType<to>
}

type FromRlpCursorErrorType =
  | BytesToHexErrorType
  | ReadLengthErrorType
  | ReadListErrorType
  | ErrorType

function fromRlpCursor<to extends To = 'hex'>(
  cursor: Cursor,
  to: to | To | undefined = 'hex',
): FromRlpReturnType<to> {
  if (cursor.bytes.length === 0)
    return (
      to === 'hex' ? bytesToHex(cursor.bytes) : cursor.bytes
    ) as FromRlpReturnType<to>

  const prefix = cursor.readByte()
  if (prefix < 0x80) cursor.decrementPosition(1)

  // bytes
  if (prefix < 0xc0) {
    const length = readLength(cursor, prefix, 0x80)
    const bytes = cursor.readBytes(length)
    return (to === 'hex' ? bytesToHex(bytes) : bytes) as FromRlpReturnType<to>
  }

  // list
  const length = readLength(cursor, prefix, 0xc0)
  return readList(cursor, length, to) as {} as FromRlpReturnType<to>
}

type ReadLengthErrorType = BaseErrorType | ErrorType

function readLength(cursor: Cursor, prefix: number, offset: number) {
  if (offset === 0x80 && prefix < 0x80) return 1
  if (prefix <= offset + 55) return prefix - offset
  if (prefix === offset + 55 + 1) return cursor.readUint8()
  if (prefix === offset + 55 + 2) return cursor.readUint16()
  if (prefix === offset + 55 + 3) return cursor.readUint24()
  if (prefix === offset + 55 + 4) return cursor.readUint32()
  throw new BaseError('Invalid RLP prefix')
}

type ReadListErrorType = ErrorType

function readList<to extends To>(cursor: Cursor, length: number, to: to | To) {
  const position = cursor.position
  const value: FromRlpReturnType<to>[] = []
  while (cursor.position - position < length)
    value.push(fromRlpCursor(cursor, to))
  return value
}
