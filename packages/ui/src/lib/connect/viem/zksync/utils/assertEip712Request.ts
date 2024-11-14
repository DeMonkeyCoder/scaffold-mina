import type { ErrorType } from '../../errors/utils'
import type { ExactPartial } from '../../types/utils'
import {
  type AssertRequestErrorType,
  assertRequest,
} from '../../utils/transaction/assertRequest'
import type { zksync } from '../../zksync/chains'
import type { SendTransactionParameters } from '../actions/sendTransaction'
import {
  InvalidEip712TransactionError,
  type InvalidEip712TransactionErrorType,
} from '../errors/transaction'
import { isEIP712Transaction } from './isEip712Transaction'

export type AssertEip712RequestParameters = ExactPartial<
  SendTransactionParameters<typeof zksync>
>

/** @internal */
export type AssertEip712RequestErrorType =
  | InvalidEip712TransactionErrorType
  | AssertRequestErrorType
  | ErrorType

export function assertEip712Request(args: AssertEip712RequestParameters) {
  if (!isEIP712Transaction(args as any))
    throw new InvalidEip712TransactionError()
  assertRequest(args as any)
}
