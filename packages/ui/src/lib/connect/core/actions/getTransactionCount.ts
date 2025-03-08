import {
  type GetTransactionCountErrorType as viem_GetTransactionCountErrorType,
  type GetTransactionCountParameters as viem_GetTransactionCountParameters,
  type GetTransactionCountReturnType as viem_GetTransactionCountReturnType,
  getTransactionCount as viem_getTransactionCount,
} from 'vimina/actions'

import type { Config } from '../createConfig'
import type { NetworkIdParameter } from '../types/properties'
import type { Compute } from '../types/utils'
import { getAction } from '../utils/getAction'

export type GetTransactionCountParameters<config extends Config = Config> =
  Compute<NetworkIdParameter<config> & viem_GetTransactionCountParameters>

export type GetTransactionCountReturnType = viem_GetTransactionCountReturnType

export type GetTransactionCountErrorType = viem_GetTransactionCountErrorType

/** https://wagmi.sh/core/api/actions/getTransactionCount */
export async function getTransactionCount<config extends Config>(
  config: config,
  parameters: GetTransactionCountParameters<config>,
): Promise<GetTransactionCountReturnType> {
  const { address, blockNumber, blockTag, networkId } = parameters

  const client = config.getClient({ networkId })
  const action = getAction(
    client,
    viem_getTransactionCount,
    'getTransactionCount',
  )
  return action(blockNumber ? { address, blockNumber } : { address, blockTag })
}
