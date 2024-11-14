import type { Chain, ChainFormatters } from '../../types/chain'
import type { Assign, Prettify } from '../../types/utils'

export function defineChain<
  formatters extends ChainFormatters,
  const chain extends Chain<formatters>,
>(chain: chain): Prettify<Assign<Chain<undefined>, chain>> {
  return {
    formatters: undefined,
    fees: undefined,
    serializers: undefined,
    ...chain,
  } as Assign<Chain<undefined>, chain>
}
