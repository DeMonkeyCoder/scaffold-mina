// TODO(v3): This file is here for backwards compatibility, and to prevent breaking changes.
// These APIs will be removed in v3.

/* c8 ignore start */
import type {
  TimeoutErrorType,
  WebSocketRequestError,
} from '../../errors/request'
import type { ErrorType } from '../../errors/utils'
import type { RpcResponse } from '../../types/rpc'
import type { WithTimeoutErrorType } from '../promise/withTimeout'
import { type HttpRequestParameters, getHttpRpcClient } from './http'
import type { SocketRpcClient } from './socket'
import { getWebSocketRpcClient } from './webSocket'

export type WebSocketOptions = Parameters<
  SocketRpcClient<WebSocket>['request']
>[0]
export type WebSocketReturnType = SocketRpcClient<WebSocket>
export type WebSocketErrorType = WebSocketRequestError | ErrorType

function webSocket(
  socketClient: SocketRpcClient<WebSocket>,
  { body, onError, onResponse }: WebSocketOptions,
): WebSocketReturnType {
  socketClient.request({
    body,
    onError,
    onResponse,
  })
  return socketClient
}

export type WebSocketAsyncOptions = Parameters<
  SocketRpcClient<WebSocket>['requestAsync']
>[0]
export type WebSocketAsyncReturnType = RpcResponse
export type WebSocketAsyncErrorType =
  | WebSocketErrorType
  | TimeoutErrorType
  | WithTimeoutErrorType
  | ErrorType

async function webSocketAsync(
  socketClient: SocketRpcClient<WebSocket>,
  { body, timeout = 10_000 }: WebSocketAsyncOptions,
): Promise<WebSocketAsyncReturnType> {
  return socketClient.requestAsync({
    body,
    timeout,
  })
}

/**
 * @deprecated use `getSocketClient` instead.
 *
 * ```diff
 * -import { getSocket } from '@/lib/connect/viem/utils'
 * +import { getSocketClient } from '@/lib/connect/viem/utils'
 *
 * -const socket = await getSocket(url)
 * +const socketClient = await getSocketClient(url)
 * +const socket = socketClient.socket
 * ```
 */
export async function getSocket(url: string) {
  const client = await getWebSocketRpcClient(url)
  return Object.assign(client.socket, {
    requests: client.requests,
    subscriptions: client.subscriptions,
  })
}

export const rpc = {
  /**
   * @deprecated use `getHttpRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from '@/lib/connect/viem/utils'
   * +import { getHttpRpcClient } from '@/lib/connect/viem/utils'
   *
   * -rpc.http(url, params)
   * +const httpClient = getHttpRpcClient(url)
   * +httpClient.request(params)
   * ```
   */
  http(url: string, params: HttpRequestParameters) {
    return getHttpRpcClient(url).request(params)
  },
  /**
   * @deprecated use `getWebSocketRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from '@/lib/connect/viem/utils'
   * +import { getWebSocketRpcClient } from '@/lib/connect/viem/utils'
   *
   * -rpc.webSocket(url, params)
   * +const webSocketClient = getWebSocketRpcClient(url)
   * +webSocketClient.request(params)
   * ```
   */
  webSocket,
  /**
   * @deprecated use `getWebSocketRpcClient` instead.
   *
   * ```diff
   * -import { rpc } from '@/lib/connect/viem/utils'
   * +import { getWebSocketRpcClient } from '@/lib/connect/viem/utils'
   *
   * -const response = await rpc.webSocketAsync(url, params)
   * +const webSocketClient = getWebSocketRpcClient(url)
   * +const response = await webSocketClient.requestAsync(params)
   * ```
   */
  webSocketAsync,
}
/* c8 ignore end */
