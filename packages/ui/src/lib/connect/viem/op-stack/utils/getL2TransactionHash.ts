// Adapted from https://github.com/ethereum-optimism/optimism/blob/develop/packages/core-utils/src/optimism/deposit-transaction.ts#L117

import type { ErrorType } from '../../errors/utils'
import type { Log } from '../../types/log'
import type { Hex } from '../../types/misc'
import { keccak256 } from '../../utils/hash/keccak256'
import type { portalAbi } from '../abis'
import { serializeTransaction } from '../serializers'
import { getSourceHash } from './getSourceHash'
import { opaqueDataToDepositData } from './opaqueDataToDepositData'

export type GetL2TransactionHashParameters = {
  /** The "TransactionDeposited" log to compute the L2 hash from. */
  log: Log<
    bigint,
    number,
    false,
    undefined,
    true,
    typeof portalAbi,
    'TransactionDeposited'
  >
}

export type GetL2TransactionHashReturnType = Hex

export type GetL2TransactionHashErrorType = ErrorType

export function getL2TransactionHash({ log }: GetL2TransactionHashParameters) {
  const sourceHash = getSourceHash({
    domain: 'userDeposit',
    l1BlockHash: log.blockHash,
    l1LogIndex: log.logIndex,
  })
  const { data, gas, isCreation, mint, value } = opaqueDataToDepositData(
    log.args.opaqueData,
  )

  return keccak256(
    serializeTransaction({
      from: log.args.from,
      to: isCreation ? undefined : log.args.to,
      sourceHash,
      data,
      gas,
      isSystemTx: false,
      mint,
      type: 'deposit',
      value,
    }),
  )
}
