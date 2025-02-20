////////////////////////////////////////////////////////////////////////////////
// Context
////////////////////////////////////////////////////////////////////////////////

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type WagmiProviderProps,
  WagmiContext,
  WagmiProvider,
} from '../context'

////////////////////////////////////////////////////////////////////////////////
// Errors
////////////////////////////////////////////////////////////////////////////////

export { type BaseErrorType, BaseError } from '../errors/base'

export {
  type WagmiProviderNotFoundErrorType,
  WagmiProviderNotFoundError,
} from '../errors/context'

////////////////////////////////////////////////////////////////////////////////
// Hooks
////////////////////////////////////////////////////////////////////////////////

export {
  type UseAccountParameters,
  type UseAccountReturnType,
  useAccount,
} from '../hooks/useAccount'

export {
  type UseAccountEffectParameters,
  useAccountEffect,
} from '../hooks/useAccountEffect'

export {
  type UseBalanceParameters,
  type UseBalanceReturnType,
  useBalance,
} from '../hooks/useBalance'

export {
  type UseBlockHashParameters,
  type UseBlockHashReturnType,
  useBlockHash,
} from '../hooks/useBlockHash'

export {
  type UseFetchAccountParameters,
  type UseFetchAccountReturnType,
  useFetchAccount,
} from '../hooks/useFetchAccount'

export {
  type UseNetworkIdParameters,
  type UseNetworkIdReturnType,
  useNetworkId,
} from '../hooks/useNetworkId'

export {
  type UseChainsParameters,
  type UseChainsReturnType,
  useChains,
} from '../hooks/useChains'

export {
  type UseClientParameters,
  type UseClientReturnType,
  useClient,
} from '../hooks/useClient'

export {
  type UseConfigParameters,
  type UseConfigReturnType,
  useConfig,
} from '../hooks/useConfig'

export {
  type UseConnectParameters,
  type UseConnectReturnType,
  useConnect,
} from '../hooks/useConnect'

export {
  type UseConnectionsParameters,
  type UseConnectionsReturnType,
  useConnections,
} from '../hooks/useConnections'

export {
  type UseConnectorsParameters,
  type UseConnectorsReturnType,
  useConnectors,
} from '../hooks/useConnectors'

export {
  type UseConnectorClientParameters,
  type UseConnectorClientReturnType,
  useConnectorClient,
} from '../hooks/useConnectorClient'

export {
  type UseDisconnectParameters,
  type UseDisconnectReturnType,
  useDisconnect,
} from '../hooks/useDisconnect'

export {
  type UsePublicClientParameters,
  type UsePublicClientReturnType,
  usePublicClient,
} from '../hooks/usePublicClient'

export {
  type UseReconnectParameters,
  type UseReconnectReturnType,
  useReconnect,
} from '../hooks/useReconnect'

export {
  type UseSignDelegationTransactionParameters,
  type UseSignDelegationTransactionReturnType,
  useSignDelegationTransaction,
} from '../hooks/useSignDelegationTransaction'

export {
  type UseSignPaymentTransactionParameters,
  type UseSignPaymentTransactionReturnType,
  useSignPaymentTransaction,
} from '../hooks/useSignPaymentTransaction'

export {
  type UseSignZkappTransactionParameters,
  type UseSignZkappTransactionReturnType,
  useSignZkappTransaction,
} from '../hooks/useSignZkappTransaction'

export {
  type UseSwitchAccountParameters,
  type UseSwitchAccountReturnType,
  useSwitchAccount,
} from '../hooks/useSwitchAccount'

export {
  type UseSwitchChainParameters,
  type UseSwitchChainReturnType,
  useSwitchChain,
} from '../hooks/useSwitchChain'

export {
  type UseTransactionCountParameters,
  type UseTransactionCountReturnType,
  useTransactionCount,
} from '../hooks/useTransactionCount'

export {
  type UseWalletClientParameters,
  type UseWalletClientReturnType,
  useWalletClient,
} from '../hooks/useWalletClient'

export {
  type UseWatchBlockHashParameters,
  type UseWatchBlockHashReturnType,
  useWatchBlockHash,
} from '../hooks/useWatchBlockHash'

////////////////////////////////////////////////////////////////////////////////
// Hydrate
////////////////////////////////////////////////////////////////////////////////

export { type HydrateProps, Hydrate } from '../hydrate'

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
  normalizeNetworkId,
  parseCookie,
  serialize,
} from '@/lib/connect/core/exports'

////////////////////////////////////////////////////////////////////////////////
// Version
////////////////////////////////////////////////////////////////////////////////

export { version } from '../version'
