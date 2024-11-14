import {
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/utils/parseAccount'
import type { SendTransactionParameters } from '../../actions/wallet/sendTransaction'
import {
  InvalidAddressError,
  type InvalidAddressErrorType,
} from '../../errors/address'
import {
  FeeCapTooHighError,
  type FeeCapTooHighErrorType,
  TipAboveFeeCapError,
  type TipAboveFeeCapErrorType,
} from '../../errors/node'
import {
  FeeConflictError,
  type FeeConflictErrorType,
} from '../../errors/transaction'
import type { ErrorType } from '../../errors/utils'
import type { Chain } from '../../types/chain'
import type { ExactPartial } from '../../types/utils'
import { isAddress } from '../address/isAddress'

export type AssertRequestParameters = ExactPartial<
  SendTransactionParameters<Chain>
>

export type AssertRequestErrorType =
  | InvalidAddressErrorType
  | FeeConflictErrorType
  | FeeCapTooHighErrorType
  | ParseAccountErrorType
  | TipAboveFeeCapErrorType
  | ErrorType

export function assertRequest(args: AssertRequestParameters) {
  const {
    account: account_,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    to,
  } = args
  const account = account_ ? parseAccount(account_) : undefined
  if (account && !isAddress(account.address))
    throw new InvalidAddressError({ address: account.address })
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to })
  if (
    typeof gasPrice !== 'undefined' &&
    (typeof maxFeePerGas !== 'undefined' ||
      typeof maxPriorityFeePerGas !== 'undefined')
  )
    throw new FeeConflictError()

  if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
    throw new FeeCapTooHighError({ maxFeePerGas })
  if (
    maxPriorityFeePerGas &&
    maxFeePerGas &&
    maxPriorityFeePerGas > maxFeePerGas
  )
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas })
}
