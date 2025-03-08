import type { Client } from 'vimina'

import type { Config } from '../createConfig'
import type { NetworkIdParameter } from '../types/properties'
import type { Compute, IsNarrowable } from '../types/utils'

export type GetClientParameters<
  config extends Config = Config,
  networkId extends
    | config['chains'][number]['id']
    | string
    | undefined = config['chains'][number]['id'],
> = NetworkIdParameter<config, networkId>

export type GetClientReturnType<
  config extends Config = Config,
  networkId extends
    | config['chains'][number]['id']
    | undefined = config['chains'][number]['id'],
  ///
  resolvedNetworkId extends
    | config['chains'][number]['id']
    | undefined = IsNarrowable<
    config['chains'][number]['id'],
    number
  > extends true
    ? IsNarrowable<networkId, number> extends true
      ? networkId
      : config['chains'][number]['id']
    : config['chains'][number]['id'] | undefined,
> = resolvedNetworkId extends config['chains'][number]['id']
  ? Compute<
      Client<
        config['_internal']['transports'][resolvedNetworkId],
        Extract<config['chains'][number], { id: resolvedNetworkId }>
      >
    >
  : undefined

export function getClient<
  config extends Config,
  networkId extends config['chains'][number]['id'] | string | undefined,
>(
  config: config,
  parameters: GetClientParameters<config, networkId> = {},
): GetClientReturnType<config, networkId> {
  let client = undefined
  try {
    client = config.getClient(parameters)
  } catch {}
  return client as GetClientReturnType<config, networkId>
}
