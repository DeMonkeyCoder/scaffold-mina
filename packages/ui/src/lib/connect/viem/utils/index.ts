// biome-ignore lint/performance/noBarrelFile: entrypoint module
export { type RequestErrorType, buildRequest } from "./buildRequest";

export {
  type AssertCurrentChainErrorType,
  type AssertCurrentChainParameters,
  assertCurrentChain,
} from "./chain/assertCurrentChain";
export { defineChain } from "./chain/defineChain";
export {
  type ExtractChainErrorType,
  type ExtractChainParameters,
  type ExtractChainReturnType,
  extractChain,
} from "./chain/extractChain";

export {
  type WebSocketAsyncErrorType,
  type WebSocketAsyncOptions,
  type WebSocketAsyncReturnType,
  type WebSocketErrorType,
  type WebSocketOptions,
  type WebSocketReturnType,
  getSocket,
  rpc,
} from "./rpc/compat";
export {
  type HttpRpcClient,
  type HttpRpcClientOptions,
  type HttpRequestErrorType,
  type HttpRequestParameters,
  type HttpRequestReturnType,
  getHttpRpcClient,
} from "./rpc/http";
export {
  type GetSocketRpcClientErrorType,
  type GetSocketRpcClientParameters,
  type GetSocketParameters,
  type Socket,
  type SocketRpcClient,
  getSocketRpcClient,
  socketClientCache,
} from "./rpc/socket";
export { getWebSocketRpcClient } from "./rpc/webSocket";
export { type StringifyErrorType, stringify } from "./stringify";
export {
  type ParseAccountErrorType,
  parseAccount,
} from "../accounts/utils/parseAccount";
export { getAddress } from "./address/getAddress";
export {
  type IsAddressErrorType,
  type ChecksumAddressErrorType,
  validateAddressChecksum,
  isAddress,
} from "./address/isAddress";
export {
  type IsAddressEqualErrorType,
  isAddressEqual,
} from "./address/isAddressEqual";
export { getAction } from "./getAction";
export {
  type CreateNonceManagerParameters,
  type NonceManager,
  type NonceManagerSource,
  createNonceManager,
  nonceManager,
} from "./nonceManager";
