import type { ErrorType } from '../../errors/utils'
import type { Proof } from '../../types/proof'
import type { RpcProof } from '../../types/rpc'
import type { ExactPartial } from '../../types/utils'
import { hexToNumber } from '../index'

export type FormatProofErrorType = ErrorType

function formatStorageProof(storageProof: RpcProof['storageProof']) {
  return storageProof.map((proof) => ({
    ...proof,
    value: BigInt(proof.value),
  }))
}

export function formatProof(proof: ExactPartial<RpcProof>) {
  return {
    ...proof,
    balance: proof.balance ? BigInt(proof.balance) : undefined,
    nonce: proof.nonce ? hexToNumber(proof.nonce) : undefined,
    storageProof: proof.storageProof
      ? formatStorageProof(proof.storageProof)
      : undefined,
  } as Proof
}
