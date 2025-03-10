import type { Config } from '../createConfig'
import type { GetConnectorsReturnType } from './getConnectors'

export type WatchConnectorsParameters = {
  onChange(
    connections: GetConnectorsReturnType,
    prevConnectors: GetConnectorsReturnType,
  ): void
}

export type WatchConnectorsReturnType = () => void

/** https://wagmi.sh/core/api/actions/watchConnectors */
export function watchConnectors(
  config: Config,
  parameters: WatchConnectorsParameters,
): WatchConnectorsReturnType {
  const { onChange } = parameters
  return config._internal.connectors.subscribe((connectors, prevConnectors) => {
    onChange(Object.values(connectors), prevConnectors)
  })
}
