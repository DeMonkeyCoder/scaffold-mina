////////////////////////////////////////////////////////////////////////////////
// Actions
////////////////////////////////////////////////////////////////////////////////

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type CallErrorType,
  type CallParameters,
  type CallReturnType,
  call,
} from "../actions/call";

export {
  type ConnectErrorType,
  type ConnectParameters,
  type ConnectReturnType,
  connect,
} from "../actions/connect";

export {
  type DisconnectErrorType,
  type DisconnectParameters,
  type DisconnectReturnType,
  disconnect,
} from "../actions/disconnect";

export {
  type EstimateGasErrorType,
  type EstimateGasParameters,
  type EstimateGasReturnType,
  estimateGas,
} from "../actions/estimateGas";

export {
  type EstimateFeesPerGasErrorType,
  type EstimateFeesPerGasParameters,
  type EstimateFeesPerGasReturnType,
  estimateFeesPerGas,
} from "../actions/estimateFeesPerGas";

export {
  type EstimateMaxPriorityFeePerGasErrorType,
  type EstimateMaxPriorityFeePerGasParameters,
  type EstimateMaxPriorityFeePerGasReturnType,
  estimateMaxPriorityFeePerGas,
} from "../actions/estimateMaxPriorityFeePerGas";

export { type GetAccountReturnType, getAccount } from "../actions/getAccount";

export {
  type GetBlockErrorType,
  type GetBlockParameters,
  type GetBlockReturnType,
  getBlock,
} from "../actions/getBlock";

export {
  type GetBlockHashErrorType,
  type GetBlockHashParameters,
  type GetBlockHashReturnType,
  getBlockHash,
  /** @deprecated use `getBlockHash` instead */
  getBlockHash as fetchBlockHash,
} from "../actions/getBlockHash";

export {
  type GetBlockTransactionCountErrorType,
  type GetBlockTransactionCountParameters,
  type GetBlockTransactionCountReturnType,
  getBlockTransactionCount,
} from "../actions/getBlockTransactionCount";

export {
  type GetBytecodeErrorType,
  type GetBytecodeParameters,
  type GetBytecodeReturnType,
  getBytecode,
} from "../actions/getBytecode";

export {
  type GetNetworkIdReturnType,
  getNetworkId,
} from "../actions/getNetworkId";

export { type GetChainsReturnType, getChains } from "../actions/getChains";

export {
  type GetClientParameters,
  type GetClientReturnType,
  getClient,
} from "../actions/getClient";

export {
  type GetConnectionsReturnType,
  getConnections,
} from "../actions/getConnections";

export {
  type GetConnectorsReturnType,
  getConnectors,
} from "../actions/getConnectors";

export {
  type GetConnectorClientErrorType,
  type GetConnectorClientParameters,
  type GetConnectorClientReturnType,
  getConnectorClient,
} from "../actions/getConnectorClient";

export {
  type GetFeeHistoryErrorType,
  type GetFeeHistoryParameters,
  type GetFeeHistoryReturnType,
  getFeeHistory,
} from "../actions/getFeeHistory";

export {
  type GetGasPriceErrorType,
  type GetGasPriceParameters,
  type GetGasPriceReturnType,
  getGasPrice,
} from "../actions/getGasPrice";

export {
  type GetProofErrorType,
  type GetProofParameters,
  type GetProofReturnType,
  getProof,
} from "../actions/getProof";

export {
  type GetPublicClientParameters,
  type GetPublicClientReturnType,
  getPublicClient,
} from "../actions/getPublicClient";

export {
  type GetStorageAtErrorType,
  type GetStorageAtParameters,
  type GetStorageAtReturnType,
  getStorageAt,
} from "../actions/getStorageAt";

export {
  type GetTransactionErrorType,
  type GetTransactionParameters,
  type GetTransactionReturnType,
  getTransaction,
  /** @deprecated use `getTransaction` instead */
  getTransaction as fetchTransaction,
} from "../actions/getTransaction";

export {
  type GetTransactionConfirmationsErrorType,
  type GetTransactionConfirmationsParameters,
  type GetTransactionConfirmationsReturnType,
  getTransactionConfirmations,
} from "../actions/getTransactionConfirmations";

export {
  type GetTransactionCountErrorType,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
  getTransactionCount,
} from "../actions/getTransactionCount";

export {
  type GetTransactionReceiptErrorType,
  type GetTransactionReceiptParameters,
  type GetTransactionReceiptReturnType,
  getTransactionReceipt,
} from "../actions/getTransactionReceipt";

export {
  type GetWalletClientErrorType,
  type GetWalletClientParameters,
  type GetWalletClientReturnType,
  getWalletClient,
} from "../actions/getWalletClient";

export {
  type MulticallParameters,
  type MulticallReturnType,
  multicall,
} from "../actions/multicall";

export {
  type PrepareTransactionRequestParameters,
  type PrepareTransactionRequestReturnType,
  type PrepareTransactionRequestErrorType,
  prepareTransactionRequest,
} from "../actions/prepareTransactionRequest";

export {
  type ReadContractParameters,
  type ReadContractReturnType,
  type ReadContractErrorType,
  readContract,
} from "../actions/readContract";

export {
  type ReadContractsParameters,
  type ReadContractsReturnType,
  type ReadContractsErrorType,
  readContracts,
} from "../actions/readContracts";

export {
  type ReconnectErrorType,
  type ReconnectParameters,
  type ReconnectReturnType,
  reconnect,
} from "../actions/reconnect";

export {
  type SendTransactionErrorType,
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from "../actions/sendTransaction";

export {
  type SignMessageErrorType,
  type SignMessageParameters,
  type SignMessageReturnType,
  signMessage,
} from "../actions/signMessage";

export {
  type SimulateContractErrorType,
  type SimulateContractParameters,
  type SimulateContractReturnType,
  simulateContract,
} from "../actions/simulateContract";

export {
  type SwitchAccountErrorType,
  type SwitchAccountParameters,
  type SwitchAccountReturnType,
  switchAccount,
} from "../actions/switchAccount";

export {
  type SwitchChainErrorType,
  type SwitchChainParameters,
  type SwitchChainReturnType,
  switchChain,
  /** @deprecated use `switchChain` instead */
  switchChain as switchNetwork,
} from "../actions/switchChain";

export {
  type VerifyMessageParameters,
  type VerifyMessageReturnType,
  verifyMessage,
} from "../actions/verifyMessage";

export {
  type WatchAccountParameters,
  type WatchAccountReturnType,
  watchAccount,
} from "../actions/watchAccount";

export {
  type WatchAssetParameters,
  type WatchAssetReturnType,
  watchAsset,
} from "../actions/watchAsset";

export {
  type WatchBlocksParameters,
  type WatchBlocksReturnType,
  watchBlocks,
} from "../actions/watchBlocks";

export {
  type WatchBlockHashParameters,
  type WatchBlockHashReturnType,
  watchBlockHash,
} from "../actions/watchBlockHash";

export {
  type WatchNetworkIdParameters,
  type WatchNetworkIdReturnType,
  watchNetworkId,
} from "../actions/watchNetworkId";

export {
  type WatchClientParameters,
  type WatchClientReturnType,
  watchClient,
} from "../actions/watchClient";

export {
  type WatchConnectionsParameters,
  type WatchConnectionsReturnType,
  watchConnections,
} from "../actions/watchConnections";

export {
  type WatchConnectorsParameters,
  type WatchConnectorsReturnType,
  watchConnectors,
} from "../actions/watchConnectors";

export {
  type WatchPendingTransactionsParameters,
  type WatchPendingTransactionsReturnType,
  watchPendingTransactions,
} from "../actions/watchPendingTransactions";

export {
  type WatchPublicClientParameters,
  type WatchPublicClientReturnType,
  watchPublicClient,
} from "../actions/watchPublicClient";

export {
  type WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptParameters,
  type WaitForTransactionReceiptReturnType,
  waitForTransactionReceipt,
  /** @deprecated use `waitForTransactionReceipt` instead */
  waitForTransactionReceipt as waitForTransaction,
} from "../actions/waitForTransactionReceipt";

export {
  type WriteContractErrorType,
  type WriteContractParameters,
  type WriteContractReturnType,
  writeContract,
} from "../actions/writeContract";
