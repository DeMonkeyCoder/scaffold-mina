import { InvalidAddressError } from '../../errors/address'
import { BaseError } from '../../errors/base'
import { InvalidChainIdError } from '../../errors/chain'
import type { ExactPartial } from '../../types/utils'
import { isAddress } from '../../utils/address/isAddress'
import { InvalidEip712TransactionError } from '../errors/transaction'
import type {
  ZksyncTransactionSerializable,
  ZksyncTransactionSerializableEIP712,
} from '../types/transaction'
import { isEIP712Transaction } from './isEip712Transaction'

export function assertEip712Transaction(
  transaction: ExactPartial<ZksyncTransactionSerializable>,
) {
  const { chainId, to, from, paymaster, paymasterInput } =
    transaction as ZksyncTransactionSerializableEIP712

  if (!isEIP712Transaction(transaction))
    throw new InvalidEip712TransactionError()
  if (!chainId || chainId <= 0) throw new InvalidChainIdError({ chainId })
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to })
  if (from && !isAddress(from)) throw new InvalidAddressError({ address: from })
  if (paymaster && !isAddress(paymaster))
    throw new InvalidAddressError({ address: paymaster })
  if (paymaster && !paymasterInput) {
    throw new BaseError(
      '`paymasterInput` must be provided when `paymaster` is defined',
    )
  }
  if (!paymaster && paymasterInput) {
    throw new BaseError(
      '`paymaster` must be provided when `paymasterInput` is defined',
    )
  }
}
