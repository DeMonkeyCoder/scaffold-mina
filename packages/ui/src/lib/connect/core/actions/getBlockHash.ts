import {
  type GetBlockHashErrorType as viem_GetBlockHashErrorType,
  type GetBlockHashParameters as viem_GetBlockHashParameters,
  type GetBlockHashReturnType as viem_GetBlockHashReturnType,
  getBlockHash as viem_getBlockHash,
} from 'vimina/actions'

import type { Config } from '../createConfig'
import type { NetworkIdParameter } from '../types/properties'
import type { Compute } from '../types/utils'
import { getAction } from '../utils/getAction'

export type GetBlockHashParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<viem_GetBlockHashParameters & NetworkIdParameter<config, networkId>>

export type GetBlockHashReturnType = viem_GetBlockHashReturnType

export type GetBlockHashErrorType = viem_GetBlockHashErrorType

/** https://wagmi.sh/core/api/actions/getBlockHash */
export function getBlockHash<
  config extends Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  config: config,
  parameters: GetBlockHashParameters<config, networkId> = {},
): Promise<GetBlockHashReturnType> {
  const { networkId, ...rest } = parameters
  const client = config.getClient({ networkId })
  const action = getAction(client, viem_getBlockHash, 'getBlockHash')
  return action(rest)
}
