import type { ErrorType } from '../../errors/utils'
import type { Hash } from '../../types/misc'
import {
  type EncodeAbiParametersErrorType,
  encodeAbiParameters,
} from '../../utils/abi/encodeAbiParameters'
import {
  type Keccak256ErrorType,
  keccak256,
} from '../../utils/hash/keccak256'

export type GetWithdrawalHashStorageSlotParameters = {
  withdrawalHash: Hash
}
export type GetWithdrawalHashStorageSlotReturnType = Hash
export type GetWithdrawalHashStorageSlotErrorType =
  | EncodeAbiParametersErrorType
  | Keccak256ErrorType
  | ErrorType

export function getWithdrawalHashStorageSlot({
  withdrawalHash,
}: GetWithdrawalHashStorageSlotParameters) {
  const data = encodeAbiParameters(
    [{ type: 'bytes32' }, { type: 'uint256' }],
    [withdrawalHash, 0n],
  )
  return keccak256(data)
}
