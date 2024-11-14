import type { Signature } from '../index'
import type { ChainSerializers } from '../types/chain'
import type { TransactionSerializable } from '../types/transaction'
import { concatHex } from '../utils/data/concat'
import { toHex } from '../utils/encoding/toHex'
import { toRlp } from '../utils/encoding/toRlp'
import { serializeTransaction as serializeTransaction_ } from '../utils/transaction/serializeTransaction'
import { gasPerPubdataDefault } from './constants/number'
import type {
  ZksyncTransactionSerializable,
  ZksyncTransactionSerializableEIP712,
  ZksyncTransactionSerializedEIP712,
} from './types/transaction'
import { assertEip712Transaction } from './utils/assertEip712Transaction'
import { isEIP712Transaction } from './utils/isEip712Transaction'

export function serializeTransaction(
  transaction: ZksyncTransactionSerializable,
  signature?: Signature | undefined,
) {
  if (isEIP712Transaction(transaction))
    return serializeTransactionEIP712(
      transaction as ZksyncTransactionSerializableEIP712,
    )
  return serializeTransaction_(
    transaction as TransactionSerializable,
    signature,
  )
}

export const serializers = {
  transaction: serializeTransaction,
} as const satisfies ChainSerializers

type SerializeTransactionEIP712ReturnType = ZksyncTransactionSerializedEIP712

function serializeTransactionEIP712(
  transaction: ZksyncTransactionSerializableEIP712,
): SerializeTransactionEIP712ReturnType {
  const {
    chainId,
    gas,
    nonce,
    to,
    from,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    customSignature,
    factoryDeps,
    paymaster,
    paymasterInput,
    gasPerPubdata,
    data,
  } = transaction

  assertEip712Transaction(transaction)

  const serializedTransaction = [
    nonce ? toHex(nonce) : '0x',
    maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
    maxFeePerGas ? toHex(maxFeePerGas) : '0x',
    gas ? toHex(gas) : '0x',
    to ?? '0x',
    value ? toHex(value) : '0x',
    data ?? '0x0',
    toHex(chainId),
    toHex(''),
    toHex(''),
    toHex(chainId),
    from ?? '0x',
    gasPerPubdata ? toHex(gasPerPubdata) : toHex(gasPerPubdataDefault),
    factoryDeps ?? [],
    customSignature ?? '0x', // EIP712 signature
    paymaster && paymasterInput ? [paymaster, paymasterInput] : [],
  ]

  return concatHex([
    '0x71',
    toRlp(serializedTransaction),
  ]) as SerializeTransactionEIP712ReturnType
}
