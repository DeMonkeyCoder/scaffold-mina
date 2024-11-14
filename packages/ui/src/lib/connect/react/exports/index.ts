////////////////////////////////////////////////////////////////////////////////
// Context
////////////////////////////////////////////////////////////////////////////////

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type WagmiProviderProps,
  WagmiContext,
  WagmiProvider,
  /** @deprecated Use `WagmiContext` instead */
  WagmiContext as Context,
  /** @deprecated Use `WagmiProvider` instead */
  WagmiProvider as WagmiConfig,
} from "../context";

////////////////////////////////////////////////////////////////////////////////
// Errors
////////////////////////////////////////////////////////////////////////////////

export { type BaseErrorType, BaseError } from "../errors/base";

export {
  type WagmiProviderNotFoundErrorType,
  WagmiProviderNotFoundError,
} from "../errors/context";

////////////////////////////////////////////////////////////////////////////////
// Hooks
////////////////////////////////////////////////////////////////////////////////

export {
  type UseAccountParameters,
  type UseAccountReturnType,
  useAccount,
} from "../hooks/useAccount";

export {
  type UseAccountEffectParameters,
  useAccountEffect,
} from "../hooks/useAccountEffect";

export {
  type UseBalanceParameters,
  type UseBalanceReturnType,
  useBalance,
} from "../hooks/useBalance";

export {
  type UseBlockParameters,
  type UseBlockReturnType,
  useBlock,
} from "../hooks/useBlock";

export {
  type UseBlockNumberParameters,
  type UseBlockNumberReturnType,
  useBlockNumber,
} from "../hooks/useBlockNumber";

export {
  type UseBlockTransactionCountParameters,
  type UseBlockTransactionCountReturnType,
  useBlockTransactionCount,
} from "../hooks/useBlockTransactionCount";

export {
  type UseBytecodeParameters,
  type UseBytecodeReturnType,
  useBytecode,
} from "../hooks/useBytecode";

export {
  type UseCallParameters,
  type UseCallReturnType,
  useCall,
} from "../hooks/useCall";

export {
  type UseChainIdParameters,
  type UseChainIdReturnType,
  useChainId,
} from "../hooks/useChainId";

export {
  type UseChainsParameters,
  type UseChainsReturnType,
  useChains,
} from "../hooks/useChains";

export {
  type UseClientParameters,
  type UseClientReturnType,
  useClient,
} from "../hooks/useClient";

export {
  type UseConfigParameters,
  type UseConfigReturnType,
  useConfig,
} from "../hooks/useConfig";

export {
  type UseConnectParameters,
  type UseConnectReturnType,
  useConnect,
} from "../hooks/useConnect";

export {
  type UseConnectionsParameters,
  type UseConnectionsReturnType,
  useConnections,
} from "../hooks/useConnections";

export {
  type UseConnectorsParameters,
  type UseConnectorsReturnType,
  useConnectors,
} from "../hooks/useConnectors";

export {
  type UseConnectorClientParameters,
  type UseConnectorClientReturnType,
  useConnectorClient,
} from "../hooks/useConnectorClient";

export {
  type UseDeployContractParameters,
  type UseDeployContractReturnType,
  useDeployContract,
} from "../hooks/useDeployContract";

export {
  type UseDisconnectParameters,
  type UseDisconnectReturnType,
  useDisconnect,
} from "../hooks/useDisconnect";

export {
  type UseEnsAddressParameters,
  type UseEnsAddressReturnType,
  useEnsAddress,
} from "../hooks/useEnsAddress";

export {
  type UseEnsAvatarParameters,
  type UseEnsAvatarReturnType,
  useEnsAvatar,
} from "../hooks/useEnsAvatar";

export {
  type UseEnsNameParameters,
  type UseEnsNameReturnType,
  useEnsName,
} from "../hooks/useEnsName";

export {
  type UseEnsResolverParameters,
  type UseEnsResolverReturnType,
  useEnsResolver,
} from "../hooks/useEnsResolver";

export {
  type UseEnsTextParameters,
  type UseEnsTextReturnType,
  useEnsText,
} from "../hooks/useEnsText";

export {
  type UseEstimateFeesPerGasParameters,
  type UseEstimateFeesPerGasReturnType,
  useEstimateFeesPerGas,
  /** @deprecated Use `useEstimateFeesPerGas` instead */
  useEstimateFeesPerGas as useFeeData,
} from "../hooks/useEstimateFeesPerGas";

export {
  type UseEstimateGasParameters,
  type UseEstimateGasReturnType,
  useEstimateGas,
} from "../hooks/useEstimateGas";

export {
  type UseEstimateMaxPriorityFeePerGasParameters,
  type UseEstimateMaxPriorityFeePerGasReturnType,
  useEstimateMaxPriorityFeePerGas,
} from "../hooks/useEstimateMaxPriorityFeePerGas";

export {
  type UseFeeHistoryParameters,
  type UseFeeHistoryReturnType,
  useFeeHistory,
} from "../hooks/useFeeHistory";

export {
  type UseGasPriceParameters,
  type UseGasPriceReturnType,
  useGasPrice,
} from "../hooks/useGasPrice";

export {
  type UseInfiniteContractReadsParameters,
  type UseInfiniteContractReadsReturnType,
  useInfiniteReadContracts,
  /** @deprecated Use `useInfiniteReadContracts` instead */
  useInfiniteReadContracts as useContractInfiniteReads,
} from "../hooks/useInfiniteReadContracts";

export {
  type UsePrepareTransactionRequestParameters,
  type UsePrepareTransactionRequestReturnType,
  usePrepareTransactionRequest,
} from "../hooks/usePrepareTransactionRequest";

export {
  type UseProofParameters,
  type UseProofReturnType,
  useProof,
} from "../hooks/useProof";

export {
  type UsePublicClientParameters,
  type UsePublicClientReturnType,
  usePublicClient,
} from "../hooks/usePublicClient";

export {
  type UseReadContractParameters,
  type UseReadContractReturnType,
  useReadContract,
  /** @deprecated Use `useWriteContract` instead */
  useReadContract as useContractRead,
} from "../hooks/useReadContract";

export {
  type UseReadContractsParameters,
  type UseReadContractsReturnType,
  useReadContracts,
  /** @deprecated Use `useWriteContract` instead */
  useReadContracts as useContractReads,
} from "../hooks/useReadContracts";

export {
  type UseReconnectParameters,
  type UseReconnectReturnType,
  useReconnect,
} from "../hooks/useReconnect";

export {
  type UseSendTransactionParameters,
  type UseSendTransactionReturnType,
  useSendTransaction,
} from "../hooks/useSendTransaction";

export {
  type UseSignMessageParameters,
  type UseSignMessageReturnType,
  useSignMessage,
} from "../hooks/useSignMessage";

export {
  type UseSignTypedDataParameters,
  type UseSignTypedDataReturnType,
  useSignTypedData,
} from "../hooks/useSignTypedData";

export {
  type UseSimulateContractParameters,
  type UseSimulateContractReturnType,
  useSimulateContract,
} from "../hooks/useSimulateContract";

export {
  type UseStorageAtParameters,
  type UseStorageAtReturnType,
  useStorageAt,
} from "../hooks/useStorageAt";

export {
  type UseSwitchAccountParameters,
  type UseSwitchAccountReturnType,
  useSwitchAccount,
} from "../hooks/useSwitchAccount";

export {
  type UseSwitchChainParameters,
  type UseSwitchChainReturnType,
  useSwitchChain,
} from "../hooks/useSwitchChain";

export {
  type UseTokenParameters,
  type UseTokenReturnType,
  /** @deprecated Use `useReadContracts` instead */
  useToken,
} from "../hooks/useToken";

export {
  type UseTransactionParameters,
  type UseTransactionReturnType,
  useTransaction,
} from "../hooks/useTransaction";

export {
  type UseTransactionConfirmationsParameters,
  type UseTransactionConfirmationsReturnType,
  useTransactionConfirmations,
} from "../hooks/useTransactionConfirmations";

export {
  type UseTransactionCountParameters,
  type UseTransactionCountReturnType,
  useTransactionCount,
} from "../hooks/useTransactionCount";

export {
  type UseTransactionReceiptParameters,
  type UseTransactionReceiptReturnType,
  useTransactionReceipt,
} from "../hooks/useTransactionReceipt";

export {
  type UseVerifyMessageParameters,
  type UseVerifyMessageReturnType,
  useVerifyMessage,
} from "../hooks/useVerifyMessage";

export {
  type UseVerifyTypedDataParameters,
  type UseVerifyTypedDataReturnType,
  useVerifyTypedData,
} from "../hooks/useVerifyTypedData";

export {
  type UseWalletClientParameters,
  type UseWalletClientReturnType,
  useWalletClient,
} from "../hooks/useWalletClient";

export {
  type UseWaitForTransactionReceiptParameters,
  type UseWaitForTransactionReceiptReturnType,
  useWaitForTransactionReceipt,
} from "../hooks/useWaitForTransactionReceipt";

export {
  type UseWatchAssetParameters,
  type UseWatchAssetReturnType,
  useWatchAsset,
} from "../hooks/useWatchAsset";

export {
  type UseWatchBlocksParameters,
  type UseWatchBlocksReturnType,
  useWatchBlocks,
} from "../hooks/useWatchBlocks";

export {
  type UseWatchBlockNumberParameters,
  type UseWatchBlockNumberReturnType,
  useWatchBlockNumber,
} from "../hooks/useWatchBlockNumber";

export {
  type UseWatchContractEventParameters,
  type UseWatchContractEventReturnType,
  useWatchContractEvent,
} from "../hooks/useWatchContractEvent";

export {
  type UseWatchPendingTransactionsParameters,
  type UseWatchPendingTransactionsReturnType,
  useWatchPendingTransactions,
} from "../hooks/useWatchPendingTransactions";

export {
  type UseWriteContractParameters,
  type UseWriteContractReturnType,
  useWriteContract,
  /** @deprecated Use `useWriteContract` instead */
  useWriteContract as useContractWrite,
} from "../hooks/useWriteContract";

////////////////////////////////////////////////////////////////////////////////
// Hydrate
////////////////////////////////////////////////////////////////////////////////

export { type HydrateProps, Hydrate } from "../hydrate";

////////////////////////////////////////////////////////////////////////////////
// @/lib/connect/core/exports
////////////////////////////////////////////////////////////////////////////////

export {
  // Config
  type Connection,
  type Connector,
  type Config,
  type CreateConfigParameters,
  type State,
  createConfig,
  // Connector
  type ConnectorEventMap,
  type CreateConnectorFn,
  createConnector,
  // Errors
  type ChainNotConfiguredErrorType,
  ChainNotConfiguredError,
  type ConnectorAlreadyConnectedErrorType,
  ConnectorAlreadyConnectedError,
  type ConnectorNotFoundErrorType,
  ConnectorNotFoundError,
  type ConnectorAccountNotFoundErrorType,
  ConnectorAccountNotFoundError,
  type ProviderNotFoundErrorType,
  ProviderNotFoundError,
  type SwitchChainNotSupportedErrorType,
  SwitchChainNotSupportedError,
  // Storage
  type CreateStorageParameters,
  type Storage,
  createStorage,
  noopStorage,
  // Transports
  custom,
  fallback,
  http,
  webSocket,
  unstable_connector,
  // Types
  type Register,
  type ResolvedRegister,
  // Utilities
  cookieStorage,
  cookieToInitialState,
  deepEqual,
  deserialize,
  normalizeChainId,
  parseCookie,
  serialize,
} from "@/lib/connect/core/exports";

////////////////////////////////////////////////////////////////////////////////
// Version
////////////////////////////////////////////////////////////////////////////////

export { version } from "../version";
