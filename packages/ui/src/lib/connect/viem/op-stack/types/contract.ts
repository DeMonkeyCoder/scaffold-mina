import type { Address } from 'abitype'

import type { Chain } from '../../types/chain'
import type { Prettify } from '../../types/utils'
import type { TargetChain } from './chain'

export type GetContractAddressParameter<
  chain extends Chain | undefined,
  contractName extends string,
> =
  | (chain extends Chain
      ? Prettify<
          {
            targetChain: Prettify<TargetChain<chain, contractName>>
          } & {
            [_ in `${contractName}Address`]?: undefined
          }
        >
      : never)
  | Prettify<
      {
        targetChain?: undefined
      } & {
        [_ in `${contractName}Address`]: Address
      }
    >
