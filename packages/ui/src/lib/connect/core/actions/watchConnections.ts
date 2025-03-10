import type { Config } from '../createConfig'
import { deepEqual } from '../utils/deepEqual'
import { type GetConnectionsReturnType, getConnections } from './getConnections'

export type WatchConnectionsParameters = {
  onChange(
    connections: GetConnectionsReturnType,
    prevConnections: GetConnectionsReturnType,
  ): void
}

export type WatchConnectionsReturnType = () => void

/** https://wagmi.sh/core/api/actions/watchConnections */
export function watchConnections(
  config: Config,
  parameters: WatchConnectionsParameters,
): WatchConnectionsReturnType {
  const { onChange } = parameters
  return config.subscribe(() => getConnections(config), onChange, {
    equalityFn: deepEqual,
  })
}
