import type { Config, Connector } from '../createConfig'
import { deepEqual } from '../utils/deepEqual'

export type GetConnectorsReturnType = readonly Connector[]

let previousConnectors: readonly Connector[] = []

/** https://wagmi.sh/core/api/actions/getConnectors */
export function getConnectors(config: Config): GetConnectorsReturnType {
  const connectors = config.connectors
  if (deepEqual(previousConnectors, connectors)) return previousConnectors
  previousConnectors = connectors
  return connectors
}
