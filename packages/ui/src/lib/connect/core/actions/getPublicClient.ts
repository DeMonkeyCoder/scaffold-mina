import { type Client, type PublicClient, publicActions } from 'vimina'

import type { Config } from '../createConfig'
import type { NetworkIdParameter } from '../types/properties'
import type { Compute, IsNarrowable } from '../types/utils'
import { getClient } from './getClient'

export type GetPublicClientParameters<
  config extends Config = Config,
  networkId extends
    | config['chains'][number]['id']
    | undefined = config['chains'][number]['id'],
> = NetworkIdParameter<config, networkId>

export type GetPublicClientReturnType<
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
      PublicClient<
        config['_internal']['transports'][resolvedNetworkId],
        Extract<config['chains'][number], { id: resolvedNetworkId }>
      >
    >
  : undefined

export function getPublicClient<
  config extends Config,
  networkId extends config['chains'][number]['id'] | string | undefined,
>(
  config: config,
  parameters: GetPublicClientParameters<config, networkId> = {},
): GetPublicClientReturnType<config, networkId> {
  const client = getClient(config, parameters)
  return (client as Client)?.extend(publicActions) as GetPublicClientReturnType<
    config,
    networkId
  >
}
