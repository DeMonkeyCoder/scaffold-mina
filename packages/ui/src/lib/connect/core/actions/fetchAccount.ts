import type { Address, Chain } from 'vimina'
import {
  type FetchAccountErrorType as viem_FetchAccountErrorType,
  type FetchAccountParameters as viem_FetchAccountParameters,
  type FetchAccountReturnType as viem_FetchAccountReturnType,
  fetchAccount as viem_fetchAccount,
} from 'vimina/actions'

import type { SelectChains } from '@/lib/connect/core/types/chain'
import type { NetworkIdParameter } from '@/lib/connect/core/types/properties'
import type { Config } from '../createConfig'
import type { Unit } from '../types/unit'
import type { Compute } from '../types/utils'
import { getAction } from '../utils/getAction'

export type FetchAccountParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  chains extends readonly Chain[] = SelectChains<config, networkId>,
> = Compute<
  {
    [key in keyof chains]: Compute<
      viem_FetchAccountParameters<chains[key], chains[key]> & {
        /** @deprecated */
        token?: Address | undefined
        /** @deprecated */
        unit?: Unit | undefined
      } & NetworkIdParameter<config, networkId>
    >
  }[number]
>

export type FetchAccountErrorType = viem_FetchAccountErrorType

export type FetchAccountReturnType = viem_FetchAccountReturnType

/** https://wagmi.sh/core/api/actions/fetchAccount */
export async function fetchAccount<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: FetchAccountParameters<config, networkId>,
): Promise<FetchAccountReturnType> {
  const { address, networkId } = parameters

  const client = config.getClient({ networkId })
  const action = getAction(client, viem_fetchAccount, 'fetchAccount')

  const chain = config.chains.find((x) => x.id === networkId) ?? client.chain!
  return action({
    address,
    chain,
  })
}
