import type { ZkappCommand } from 'o1js/dist/web/bindings/mina-transaction/gen/transaction-json'
import type { UInt32 } from 'o1js/dist/web/bindings/mina-transaction/transaction-leaves-json'
import type { Hash, Signature } from './misc'
import type { OneOf } from './utils'
//
// export type AccessList = readonly {
//   address: Address
//   storageKeys: readonly Hex[]
// }[]

export type TransactionType = 'zkapp' | 'payment' | 'delegation' | (string & {})

export type TransactionReceipt = {
  /** Hash of this transaction */
  transactionHash: Hash
}

// export type TransactionBase<
//   quantity = bigint,
//   index = number,
//   isPending extends boolean = boolean,
// > = {
//   /** Hash of block containing this transaction or `null` if pending */
//   blockHash: isPending extends true ? null : Hash
//   /** Number of block containing this transaction or `null` if pending */
//   blockNumber: isPending extends true ? null : quantity
//   /** Transaction sender */
//   from: Address
//   /** Gas provided for transaction execution */
//   gas: quantity
//   /** Hash of this transaction */
//   hash: Hash
//   /** Contract code or a hashed method call */
//   input: Hex
//   /** Unique number identifying this transaction */
//   nonce: index
//   /** ECDSA signature r */
//   r: Hex
//   /** ECDSA signature s */
//   s: Hex
//   /** Transaction recipient or `null` if deploying a contract */
//   to: Address | null
//   /** Index of this transaction in the block or `null` if pending */
//   transactionIndex: isPending extends true ? null : index
//   /** The type represented as hex. */
//   typeHex: Hex | null
//   /** ECDSA recovery ID */
//   v: quantity
//   /** Value in wei sent with this transaction */
//   value: quantity
//   /** The parity of the y-value of the secp256k1 signature. */
//   yParity: index
// }
//
// export type TransactionLegacy<
//   quantity = bigint,
//   index = number,
//   isPending extends boolean = boolean,
//   type = 'legacy',
// > = Omit<TransactionBase<quantity, index, isPending>, 'yParity'> & {
//   /** EIP-2930 Access List. */
//   accessList?: undefined
//   authorizationList?: undefined
//   blobVersionedHashes?: undefined
//   /** Chain ID that this transaction is valid on. */
//   chainId?: index | undefined
//   yParity?: undefined
//   type: type
// } & FeeValuesLegacy<quantity>
//
// export type TransactionEIP2930<
//   quantity = bigint,
//   index = number,
//   isPending extends boolean = boolean,
//   type = 'eip2930',
// > = TransactionBase<quantity, index, isPending> & {
//   /** EIP-2930 Access List. */
//   accessList: AccessList
//   authorizationList?: undefined
//   blobVersionedHashes?: undefined
//   /** Chain ID that this transaction is valid on. */
//   chainId: index
//   type: type
// } & FeeValuesLegacy<quantity>
//
// export type TransactionEIP1559<
//   quantity = bigint,
//   index = number,
//   isPending extends boolean = boolean,
//   type = 'eip1559',
// > = TransactionBase<quantity, index, isPending> & {
//   /** EIP-2930 Access List. */
//   accessList: AccessList
//   authorizationList?: undefined
//   blobVersionedHashes?: undefined
//   /** Chain ID that this transaction is valid on. */
//   chainId: index
//   type: type
// } & FeeValuesEIP1559<quantity>
//
// export type TransactionEIP4844<
//   quantity = bigint,
//   index = number,
//   isPending extends boolean = boolean,
//   type = 'eip4844',
// > = TransactionBase<quantity, index, isPending> & {
//   /** EIP-2930 Access List. */
//   accessList: AccessList
//   authorizationList?: undefined
//   /** List of versioned blob hashes associated with the transaction's blobs. */
//   blobVersionedHashes: readonly Hex[]
//   /** Chain ID that this transaction is valid on. */
//   chainId: index
//   type: type
// } & FeeValuesEIP4844<quantity>
//
// export type TransactionEIP7702<
//   quantity = bigint,
//   index = number,
//   isPending extends boolean = boolean,
//   type = 'eip7702',
// > = TransactionBase<quantity, index, isPending> & {
//   /** EIP-2930 Access List. */
//   accessList: AccessList
//   /** Authorization list for the transaction. */
//   authorizationList: SignedAuthorizationList
//   blobVersionedHashes?: undefined
//   /** Chain ID that this transaction is valid on. */
//   chainId: index
//   type: type
// } & FeeValuesEIP1559<quantity>
//
// export type Transaction<
//   quantity = bigint,
//   index = number,
//   isPending extends boolean = boolean,
// > = OneOf<
//   | TransactionLegacy<quantity, index, isPending>
//   | TransactionEIP2930<quantity, index, isPending>
//   | TransactionEIP1559<quantity, index, isPending>
//   | TransactionEIP4844<quantity, index, isPending>
//   | TransactionEIP7702<quantity, index, isPending>
// >

////////////////////////////////////////////////////////////////////////////////////////////
// Request
////////////////////////////////////////////////////////////////////////////////////////////

export type TransactionRequestZkApp = {
  type: 'zkapp'
  zkappCommand: ZkappCommand
  feePayer?: {
    publicKey?: string
    fee?: bigint
    validUntil?: UInt32
    nonce?: UInt32
    memo?: string
  }
}
export type TransactionRequestPayment = {
  type: 'payment'
  from: string
  to: string
  amount: bigint
  fee?: bigint
  nonce?: UInt32
  memo?: string
}
export type TransactionRequestDelegation = {
  type: 'delegation'
  from: string
  to: string
  fee?: bigint
  nonce?: UInt32
  memo?: string
}

export type TransactionRequest = OneOf<
  | TransactionRequestZkApp
  | TransactionRequestPayment
  | TransactionRequestDelegation
>

////////////////////////////////////////////////////////////////////////////////////////////
// Signed Request
////////////////////////////////////////////////////////////////////////////////////////////

//TODO: see if optional nonce can also be added to the types or not
export type TransactionRequestZkAppSigned = {
  type: 'zkapp'
  input: {
    zkappCommand: ZkappCommand
  }
}
export type TransactionRequestPaymentSigned = {
  type: 'payment'
  input: Omit<TransactionRequestPayment, 'type'>
  signature: Signature
}
export type TransactionRequestDelegationSigned = {
  type: 'delegation'
  input: Omit<TransactionRequestDelegation, 'type'>
  signature: Signature
}

export type TransactionRequestSigned = OneOf<
  | TransactionRequestZkAppSigned
  | TransactionRequestPaymentSigned
  | TransactionRequestDelegationSigned
>
