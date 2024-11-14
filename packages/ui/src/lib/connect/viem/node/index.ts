// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type IpcTransport,
  type IpcTransportConfig,
  type IpcTransportErrorType,
  ipc,
} from '../clients/transports/ipc'

export { mainnetTrustedSetupPath } from './trustedSetups'

export {
  type IpcRpcClient,
  getIpcRpcClient,
} from '../utils/rpc/ipc'
