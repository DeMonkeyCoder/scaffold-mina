import type { Address } from 'vimina'
import {
  type FetchAccountErrorType as viem_FetchAccountErrorType,
  type FetchAccountParameters as viem_FetchAccountParameters,
  type FetchAccountReturnType as viem_FetchAccountReturnType,
  fetchAccount as viem_fetchAccount,
} from 'vimina/actions'

import type { Config } from '../createConfig'
import type { NetworkIdParameter } from '../types/properties'
import type { Unit } from '../types/unit'
import type { Compute } from '../types/utils'
import { getAction } from '../utils/getAction'

export type FetchAccountParameters<config extends Config = Config> = Compute<
  NetworkIdParameter<config> &
    viem_FetchAccountParameters & {
      /** @deprecated */
      token?: Address | undefined
      /** @deprecated */
      unit?: Unit | undefined
    }
>

export type FetchAccountErrorType = viem_FetchAccountErrorType

export type FetchAccountReturnType = viem_FetchAccountReturnType

/** https://wagmi.sh/core/api/actions/fetchAccount */
export async function fetchAccount<config extends Config>(
  config: config,
  parameters: FetchAccountParameters<config>,
): Promise<FetchAccountReturnType> {
  const { address, blockNumber, blockTag, networkId } = parameters

  const client = config.getClient({ networkId })
  const action = getAction(client, viem_fetchAccount, 'fetchAccount')
  return action(blockNumber ? { address, blockNumber } : { address, blockTag })
}
