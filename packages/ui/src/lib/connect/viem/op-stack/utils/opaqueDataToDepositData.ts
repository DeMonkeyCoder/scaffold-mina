import type { ErrorType } from '../../errors/utils'
import type { Hex } from '../../types/misc'
import { type SizeErrorType, size } from '../../utils/data/size'
import { type SliceErrorType, slice } from '../../utils/data/slice'
import { hexToBigInt } from '../../utils/encoding/fromHex'

export type OpaqueDataToDepositDataParameters = Hex

export type OpaqueDataToDepositDataReturnType = {
  mint: bigint
  value: bigint
  gas: bigint
  isCreation: boolean
  data: Hex
}

export type OpaqueDataToDepositDataErrorType =
  | SliceErrorType
  | SizeErrorType
  | ErrorType

export function opaqueDataToDepositData(
  opaqueData: Hex,
): OpaqueDataToDepositDataReturnType {
  let offset = 0
  const mint = slice(opaqueData, offset, offset + 32)
  offset += 32
  const value = slice(opaqueData, offset, offset + 32)
  offset += 32
  const gas = slice(opaqueData, offset, offset + 8)
  offset += 8
  const isCreation = BigInt(slice(opaqueData, offset, offset + 1)) === 1n
  offset += 1
  const data =
    offset > size(opaqueData) - 1
      ? '0x'
      : slice(opaqueData, offset, opaqueData.length)
  return {
    mint: hexToBigInt(mint),
    value: hexToBigInt(value),
    gas: hexToBigInt(gas),
    isCreation,
    data,
  }
}
