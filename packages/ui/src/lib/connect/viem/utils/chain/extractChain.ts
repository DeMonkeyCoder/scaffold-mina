import type { ErrorType } from '../../errors/utils'
import type { Chain } from '../../types/chain'

export type ExtractChainParameters<
  chains extends readonly Chain[],
  chainId extends chains[number]['id'],
> = {
  chains: chains
  id: chainId | chains[number]['id']
}

export type ExtractChainReturnType<
  chains extends readonly Chain[],
  chainId extends chains[number]['id'],
> = Extract<chains[number], { id: chainId }>

export type ExtractChainErrorType = ErrorType

export function extractChain<
  const chains extends readonly Chain[],
  chainId extends chains[number]['id'],
>({
  chains,
  id,
}: ExtractChainParameters<chains, chainId>): ExtractChainReturnType<
  chains,
  chainId
> {
  return chains.find((chain) => chain.id === id) as ExtractChainReturnType<
    chains,
    chainId
  >
}
