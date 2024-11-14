// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type DeployContractErrorType,
  type DeployContractParameters,
  type DeployContractReturnType,
  deployContract,
} from './actions/deployContract'
export {
  type EstimateFeeParameters,
  type EstimateFeeReturnType,
  estimateFee,
} from './actions/estimateFee'
export {
  type GetAllBalancesParameters,
  type GetAllBalancesReturnType,
  getAllBalances,
} from './actions/getAllBalances'
export {
  type GetBlockDetailsParameters,
  type GetBlockDetailsReturnType,
  getBlockDetails,
} from './actions/getBlockDetails'
export {
  type GetDefaultBridgeAddressesReturnType,
  getDefaultBridgeAddresses,
} from './actions/getDefaultBridgeAddresses'
export { getBridgehubContractAddress } from './actions/getBridgehubContractAddress'
export {
  type GetL1AllowanceErrorType,
  type GetL1AllowanceParameters,
  type GetL1AllowanceReturnType,
  getL1Allowance,
} from './actions/getL1Allowance'
export {
  type GetL1BalanceErrorType,
  type GetL1BalanceParameters,
  type GetL1BalanceReturnType,
  getL1Balance,
} from './actions/getL1Balance'
export {
  type GetL1BatchBlockRangeParameters,
  type GetL1BatchBlockRangeReturnParameters,
  getL1BatchBlockRange,
} from './actions/getL1BatchBlockRange'
export {
  type GetL1BatchDetailsParameters,
  type GetL1BatchDetailsReturnType,
  getL1BatchDetails,
} from './actions/getL1BatchDetails'
export { getL1BatchNumber } from './actions/getL1BatchNumber'
export { getL1ChainId } from './actions/getL1ChainId'
export {
  type GetL1TokenBalanceErrorType,
  type GetL1TokenBalanceParameters,
  type GetL1TokenBalanceReturnType,
  getL1TokenBalance,
} from './actions/getL1TokenBalance'
export {
  type GetLogProofReturnType,
  type GetLogProofParameters,
  getLogProof,
} from './actions/getLogProof'
export { getMainContractAddress } from './actions/getMainContractAddress'
export {
  type GetRawBlockTransactionsParameters,
  type GetRawBlockTransactionsReturnType,
  getRawBlockTransactions,
} from './actions/getRawBlockTransactions'
export { getTestnetPaymasterAddress } from './actions/getTestnetPaymasterAddress'
export {
  type GetTransactionDetailsParameters,
  type GetTransactionDetailsReturnType,
  getTransactionDetails,
} from './actions/getTransactionDetails'
export {
  type SendTransactionErrorType,
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from './actions/sendTransaction'
export {
  type SendEip712TransactionErrorType,
  type SendEip712TransactionParameters,
  type SendEip712TransactionReturnType,
  sendEip712Transaction,
} from './actions/sendEip712Transaction'
export {
  type SignEip712TransactionErrorType,
  type SignEip712TransactionParameters,
  type SignEip712TransactionReturnType,
  signEip712Transaction,
} from './actions/signEip712Transaction'
export {
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
  signTransaction,
} from './actions/signTransaction'

export {
  /** @deprecated Use `zksync` instead */
  zksync as zkSync,
  zksync,
  /** @deprecated Use `zksync` instead */
  zksyncInMemoryNode as zkSyncInMemoryNode,
  zksyncInMemoryNode,
  /** @deprecated Use `zksync` instead */
  zksyncLocalNode as zkSyncLocalNode,
  zksyncLocalNode,
  /** @deprecated Use `zksync` instead */
  zksyncSepoliaTestnet as zkSyncSepoliaTestnet,
  zksyncSepoliaTestnet,
} from './chains'

export { chainConfig } from './chainConfig'

export {
  eip712WalletActions,
  type Eip712WalletActions,
} from './decorators/eip712'

export {
  publicActionsL1,
  type PublicActionsL1,
} from './decorators/publicL1'

export {
  publicActionsL2,
  type PublicActionsL2,
} from './decorators/publicL2'

export { serializeTransaction } from './serializers'

export type {
  /** @deprecated Use `ZksyncBlock` instead */
  ZksyncBlock as ZkSyncBlock,
  ZksyncBlock,
  /** @deprecated Use `ZksyncRpcBlock` instead */
  ZksyncRpcBlock as ZkSyncRpcBlock,
  ZksyncRpcBlock,
  ZksyncBatchDetails,
  ZksyncBlockDetails,
  ZksyncNumberParameter,
} from './types/block'
export type { ChainEIP712 } from './types/chain'
export type {
  EIP712Domain,
  EIP712DomainFn,
  /** @deprecated Use `ZksyncEip712Meta` instead */
  ZksyncEip712Meta as ZkSyncEip712Meta,
  ZksyncEip712Meta,
} from './types/eip712'
export type {
  CommonDataRawBlockTransaction,
  RawBlockTransactions,
  PublicZksyncRpcSchema,
  /** @deprecated Use `PublicZksyncRpcSchema` instead */
  PublicZksyncRpcSchema as PublicZkSyncRpcSchema,
} from './types/eip1193'
export type {
  /** @deprecated Use `ZksyncFeeValues` instead */
  ZksyncFeeValues as ZkSyncFeeValues,
  ZksyncFeeValues,
} from './types/fee'
export type {
  /** @deprecated Use `ZksyncL2ToL1Log` instead */
  ZksyncL2ToL1Log as ZkSyncL2ToL1Log,
  ZksyncL2ToL1Log,
  /** @deprecated Use `ZksyncLog` instead */
  ZksyncLog as ZkSyncLog,
  ZksyncLog,
  /** @deprecated Use `ZksyncRpcL2ToL1Log` instead */
  ZksyncRpcL2ToL1Log as ZkSyncRpcL2ToL1Log,
  ZksyncRpcL2ToL1Log,
  /** @deprecated Use `ZkSyncRpcLog` instead */
  ZksyncRpcLog as ZkSyncRpcLog,
  ZksyncRpcLog,
} from './types/log'

export type {
  TransactionRequestEIP712,
  /** @deprecated Use `ZksyncTransactionRequest_internal` instead */
  TransactionRequest as ZkSyncTransactionRequest_internal,
  TransactionRequest as ZksyncTransactionRequest_internal,
  /** @deprecated Use `ZksyncEIP712TransactionSignable` instead */
  ZksyncEIP712TransactionSignable as ZkSyncEIP712TransactionSignable,
  ZksyncEIP712TransactionSignable,
  /** @deprecated Use `ZksyncRpcTransaction` instead */
  ZksyncRpcTransaction as ZkSyncRpcTransaction,
  ZksyncRpcTransaction,
  /** @deprecated Use `ZksyncRpcTransactionEIP712` instead */
  ZksyncRpcTransactionEIP712 as ZkSyncRpcTransactionEIP712,
  ZksyncRpcTransactionEIP712,
  /** @deprecated Use `ZksyncRpcTransactionPriority` instead */
  ZksyncRpcTransactionPriority as ZkSyncRpcTransactionPriority,
  ZksyncRpcTransactionPriority,
  /** @deprecated Use `ZksyncRpcTransactionReceiptOverrides` instead */
  ZksyncRpcTransactionReceiptOverrides as ZkSyncRpcTransactionReceiptOverrides,
  ZksyncRpcTransactionReceiptOverrides,
  /** @deprecated Use `ZksyncRpcTransactionRequest` instead */
  ZksyncRpcTransactionRequest as ZkSyncRpcTransactionRequest,
  ZksyncRpcTransactionRequest,
  /** @deprecated Use `ZksyncRpcTransactionRequestEIP712` instead */
  ZksyncRpcTransactionRequestEIP712 as ZkSyncRpcTransactionRequestEIP712,
  ZksyncRpcTransactionRequestEIP712,
  /** @deprecated Use `ZksyncTransaction` instead */
  ZksyncTransaction as ZkSyncTransaction,
  ZksyncTransaction,
  /** @deprecated Use `ZksyncTransactionEIP712` instead */
  ZksyncTransactionEIP712 as ZkSyncTransactionEIP712,
  ZksyncTransactionEIP712,
  /** @deprecated Use `ZksyncTransactionReceipt` instead */
  ZksyncTransactionReceipt as ZkSyncTransactionReceipt,
  ZksyncTransactionReceipt,
  /** @deprecated Use `ZksyncTransactionReceiptOverrides` instead */
  ZksyncTransactionReceiptOverrides as ZkSyncTransactionReceiptOverrides,
  ZksyncTransactionReceiptOverrides,
  /** @deprecated Use `ZksyncTransactionRequest` instead */
  ZksyncTransactionRequest as ZkSyncTransactionRequest,
  ZksyncTransactionRequest,
  /** @deprecated Use `ZksyncTransactionRequestEIP712` instead */
  ZksyncTransactionRequestEIP712 as ZkSyncTransactionRequestEIP712,
  ZksyncTransactionRequestEIP712,
  /** @deprecated Use `ZksyncTransactionSerializable` instead */
  ZksyncTransactionSerializable as ZkSyncTransactionSerializable,
  ZksyncTransactionSerializable,
  /** @deprecated Use `ZksyncTransactionSerializableEIP712` instead */
  ZksyncTransactionSerializableEIP712 as ZkSyncTransactionSerializableEIP712,
  ZksyncTransactionSerializableEIP712,
  /** @deprecated Use `ZksyncTransactionSerialized` instead */
  ZksyncTransactionSerialized as ZkSyncTransactionSerialized,
  ZksyncTransactionSerialized,
  /** @deprecated Use `ZksyncTransactionSerializedEIP712` instead */
  ZksyncTransactionSerializedEIP712 as ZkSyncTransactionSerializedEIP712,
  ZksyncTransactionSerializedEIP712,
  /** @deprecated Use `ZksyncTransactionType` instead */
  ZksyncTransactionType as ZkSyncTransactionType,
  ZksyncTransactionType,
  /** @deprecated Use `ZksyncRawBlockTransactions` instead */
  ZksyncRawBlockTransactions as ZkSyncRawBlockTransactions,
  ZksyncRawBlockTransactions,
  /** @deprecated Use `ZksyncRpcTransactionReceipt` instead */
  ZksyncRpcTransactionReceipt as ZkSyncRpcTransactionReceipt,
  ZksyncRpcTransactionReceipt,
  /** @deprecated Use `ZksyncTransactionDetails` instead */
  ZksyncTransactionDetails as ZkSyncTransactionDetails,
  ZksyncTransactionDetails,
} from './types/transaction'

export {
  type GetApprovalBasedPaymasterInputParameters,
  type GetApprovalBasedPaymasterInputReturnType,
  getApprovalBasedPaymasterInput,
} from './utils/paymaster/getApprovalBasedPaymasterInput'
export {
  type GetGeneralPaymasterInputParameters,
  type GetGeneralPaymasterInputReturnType,
  getGeneralPaymasterInput,
} from './utils/paymaster/getGeneralPaymasterInput'
