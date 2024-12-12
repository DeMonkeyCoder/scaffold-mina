import type { Config } from '../createConfig'

export type GetNetworkIdReturnType<config extends Config = Config> =
  config['chains'][number]['id']

/** https://wagmi.sh/core/api/actions/getNetworkId */
export function getNetworkId<config extends Config>(
  config: config,
): GetNetworkIdReturnType<config> {
  return config.state.networkId
}
