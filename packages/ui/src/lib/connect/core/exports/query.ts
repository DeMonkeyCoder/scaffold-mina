////////////////////////////////////////////////////////////////////////////////
// Tanstack Query
////////////////////////////////////////////////////////////////////////////////

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type ConnectData,
  type ConnectVariables,
  type ConnectMutate,
  type ConnectMutateAsync,
  connectMutationOptions,
} from '../query/connect'

export {
  type DisconnectData,
  type DisconnectVariables,
  type DisconnectMutate,
  type DisconnectMutateAsync,
  disconnectMutationOptions,
} from '../query/disconnect'

export {
  type GetBalanceData,
  type GetBalanceOptions,
  type GetBalanceQueryFnData,
  type GetBalanceQueryKey,
  getBalanceQueryKey,
  getBalanceQueryOptions,
} from '../query/getBalance'

export {
  type GetBlockHashData,
  type GetBlockHashOptions,
  type GetBlockHashQueryFnData,
  type GetBlockHashQueryKey,
  getBlockHashQueryKey,
  getBlockHashQueryOptions,
} from '../query/getBlockHash'

export {
  type GetConnectorClientData,
  type GetConnectorClientOptions,
  type GetConnectorClientQueryFnData,
  type GetConnectorClientQueryKey,
  getConnectorClientQueryKey,
  getConnectorClientQueryOptions,
} from '../query/getConnectorClient'

export {
  type GetWalletClientData,
  type GetWalletClientOptions,
  type GetWalletClientQueryFnData,
  type GetWalletClientQueryKey,
  getWalletClientQueryKey,
  getWalletClientQueryOptions,
} from '../query/getWalletClient'

export {
  type ReconnectData,
  type ReconnectVariables,
  type ReconnectMutate,
  type ReconnectMutateAsync,
  reconnectMutationOptions,
} from '../query/reconnect'

export {
  type SwitchAccountData,
  type SwitchAccountVariables,
  type SwitchAccountMutate,
  type SwitchAccountMutateAsync,
  switchAccountMutationOptions,
} from '../query/switchAccount'

export {
  type SwitchChainData,
  type SwitchChainVariables,
  type SwitchChainMutate,
  type SwitchChainMutateAsync,
  switchChainMutationOptions,
} from '../query/switchChain'

export { hashFn, structuralSharing } from '../query/utils'
