////////////////////////////////////////////////////////////////////////////////
// Actions
////////////////////////////////////////////////////////////////////////////////

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type ConnectErrorType,
  type ConnectParameters,
  type ConnectReturnType,
  connect,
} from '../actions/connect'

export {
  type DisconnectErrorType,
  type DisconnectParameters,
  type DisconnectReturnType,
  disconnect,
} from '../actions/disconnect'

export { type GetAccountReturnType, getAccount } from '../actions/getAccount'

export {
  type GetBlockHashErrorType,
  type GetBlockHashParameters,
  type GetBlockHashReturnType,
  getBlockHash,
  /** @deprecated use `getBlockHash` instead */
  getBlockHash as fetchBlockHash,
} from '../actions/getBlockHash'

export {
  type GetNetworkIdReturnType,
  getNetworkId,
} from '../actions/getNetworkId'

export { type GetChainsReturnType, getChains } from '../actions/getChains'

export {
  type GetClientParameters,
  type GetClientReturnType,
  getClient,
} from '../actions/getClient'

export {
  type GetConnectionsReturnType,
  getConnections,
} from '../actions/getConnections'

export {
  type GetConnectorsReturnType,
  getConnectors,
} from '../actions/getConnectors'

export {
  type GetConnectorClientErrorType,
  type GetConnectorClientParameters,
  type GetConnectorClientReturnType,
  getConnectorClient,
} from '../actions/getConnectorClient'

export {
  type GetPublicClientParameters,
  type GetPublicClientReturnType,
  getPublicClient,
} from '../actions/getPublicClient'

export {
  type GetTransactionCountErrorType,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
  getTransactionCount,
} from '../actions/getTransactionCount'

export {
  type GetWalletClientErrorType,
  type GetWalletClientParameters,
  type GetWalletClientReturnType,
  getWalletClient,
} from '../actions/getWalletClient'

export {
  type ReconnectErrorType,
  type ReconnectParameters,
  type ReconnectReturnType,
  reconnect,
} from '../actions/reconnect'

export {
  type SendSignedTransactionErrorType,
  type SendSignedTransactionParameters,
  type SendSignedTransactionReturnType,
  sendSignedTransaction,
} from '../actions/sendSignedTransaction'

export {
  type SendTransactionErrorType,
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from '../actions/sendTransaction'

export {
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
  signTransaction,
} from '../actions/signTransaction'

export {
  type SwitchAccountErrorType,
  type SwitchAccountParameters,
  type SwitchAccountReturnType,
  switchAccount,
} from '../actions/switchAccount'

export {
  type SwitchChainErrorType,
  type SwitchChainParameters,
  type SwitchChainReturnType,
  switchChain,
  /** @deprecated use `switchChain` instead */
  switchChain as switchNetwork,
} from '../actions/switchChain'

export {
  type WatchAccountParameters,
  type WatchAccountReturnType,
  watchAccount,
} from '../actions/watchAccount'

export {
  type WatchBlockHashParameters,
  type WatchBlockHashReturnType,
  watchBlockHash,
} from '../actions/watchBlockHash'

export {
  type WatchNetworkIdParameters,
  type WatchNetworkIdReturnType,
  watchNetworkId,
} from '../actions/watchNetworkId'

export {
  type WatchClientParameters,
  type WatchClientReturnType,
  watchClient,
} from '../actions/watchClient'

export {
  type WatchConnectionsParameters,
  type WatchConnectionsReturnType,
  watchConnections,
} from '../actions/watchConnections'

export {
  type WatchConnectorsParameters,
  type WatchConnectorsReturnType,
  watchConnectors,
} from '../actions/watchConnectors'

export {
  type WatchPublicClientParameters,
  type WatchPublicClientReturnType,
  watchPublicClient,
} from '../actions/watchPublicClient'
