// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type AddChainErrorType,
  type AddChainParameters,
  addChain,
} from './wallet/addChain'
export {
  type FetchAccountErrorType,
  type FetchAccountParameters,
  type FetchAccountReturnType,
  fetchAccount,
} from './public/fetchAccount'
export {
  type GetBalanceErrorType,
  type GetBalanceParameters,
  type GetBalanceReturnType,
  getBalance,
} from './public/getBalance'
export {
  type GetBlockHashErrorType,
  type GetBlockHashParameters,
  type GetBlockHashReturnType,
  getBlockHash,
} from './public/getBlockHash'
export {
  type GetNetworkIdErrorType,
  type GetNetworkIdReturnType,
  getNetworkId,
} from './public/getNetworkId'
export {
  type GetTransactionCountErrorType,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
  getTransactionCount,
} from './public/getTransactionCount'
export {
  type OnBlockHashFn,
  type OnBlockHashParameter,
  type WatchBlockHashErrorType,
  type WatchBlockHashParameters,
  type WatchBlockHashReturnType,
  watchBlockHash,
} from './public/watchBlockHash'
export {
  type GetAddressesErrorType,
  type GetAddressesReturnType,
  getAddresses,
} from './wallet/getAddresses'
export {
  type GetPermissionsErrorType,
  type GetPermissionsReturnType,
  getPermissions,
} from './wallet/getPermissions'
export {
  type RequestAddressesErrorType,
  type RequestAddressesReturnType,
  requestAddresses,
} from './wallet/requestAddresses'
export {
  type RequestPermissionsErrorType,
  type RequestPermissionsReturnType,
  type RequestPermissionsParameters,
  requestPermissions,
} from './wallet/requestPermissions'
export {
  type SendSignedTransactionErrorType,
  type SendSignedTransactionParameters,
  type SendSignedTransactionReturnType,
  sendSignedTransaction,
} from './wallet/sendSignedTransaction'
export {
  type SendTransactionErrorType,
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from './wallet/sendTransaction'
export {
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
  signTransaction,
} from './wallet/signTransaction'
export {
  type SwitchChainErrorType,
  type SwitchChainParameters,
  switchChain,
} from './wallet/switchChain'
