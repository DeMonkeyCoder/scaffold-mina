import type { Address } from 'vimina'
import {
  type GetBalanceErrorType as viem_GetBalanceErrorType,
  type GetBalanceParameters as viem_GetBalanceParameters,
  getBalance as viem_getBalance,
} from 'vimina/actions'

import type { Config } from '../createConfig'
import type { NetworkIdParameter } from '../types/properties'
import type { Unit } from '../types/unit'
import type { Compute } from '../types/utils'
import { getAction } from '../utils/getAction'

export type GetBalanceParameters<config extends Config = Config> = Compute<
  NetworkIdParameter<config> &
    viem_GetBalanceParameters & {
      /** @deprecated */
      token?: Address | undefined
      /** @deprecated */
      unit?: Unit | undefined
    }
>

export type GetBalanceReturnType = {
  decimals: number
  symbol: string
  value: bigint
}

export type GetBalanceErrorType = viem_GetBalanceErrorType

/** https://wagmi.sh/core/api/actions/getBalance */
export async function getBalance<config extends Config>(
  config: config,
  parameters: GetBalanceParameters<config>,
): Promise<GetBalanceReturnType> {
  const {
    address,
    blockNumber,
    blockTag,
    networkId,
    token: tokenAddress,
  } = parameters

  if (tokenAddress) {
    throw new Error('not supported yet')
  }
  const client = config.getClient({ networkId })
  const action = getAction(client, viem_getBalance, 'getBalance')
  const value = await action(
    blockNumber ? { address, blockNumber } : { address, blockTag },
  )
  const chain = config.chains.find((x) => x.id === networkId) ?? client.chain!
  return {
    decimals: chain.nativeCurrency.decimals,
    symbol: chain.nativeCurrency.symbol,
    value,
  }
}
