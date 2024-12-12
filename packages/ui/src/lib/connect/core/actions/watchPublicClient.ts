import type { Config } from '../createConfig'
import {
  type GetPublicClientReturnType,
  getPublicClient,
} from './getPublicClient'

export type WatchPublicClientParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = {
  onChange(
    publicClient: GetPublicClientReturnType<config, networkId>,
    prevPublicClient: GetPublicClientReturnType<config, networkId>,
  ): void
}

export type WatchPublicClientReturnType = () => void

/** https://wagmi.sh/core/api/actions/watchPublicClient */
export function watchPublicClient<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: WatchPublicClientParameters<config, networkId>,
): WatchPublicClientReturnType {
  const { onChange } = parameters
  return config.subscribe(
    () =>
      getPublicClient(config) as GetPublicClientReturnType<config, networkId>,
    onChange,
    {
      equalityFn(a, b) {
        return a?.uid === b?.uid
      },
    },
  )
}
