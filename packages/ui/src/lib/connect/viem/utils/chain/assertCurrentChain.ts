import {
  ChainMismatchError,
  type ChainMismatchErrorType,
  ChainNotFoundError,
  type ChainNotFoundErrorType,
} from '../../errors/chain'
import type { ErrorType } from '../../errors/utils'
import type { Chain } from '../../types/chain'

export type AssertCurrentChainParameters = {
  chain?: Chain | undefined
  currentChainId: number
}

export type AssertCurrentChainErrorType =
  | ChainNotFoundErrorType
  | ChainMismatchErrorType
  | ErrorType

export function assertCurrentChain({
  chain,
  currentChainId,
}: AssertCurrentChainParameters): void {
  if (!chain) throw new ChainNotFoundError()
  if (currentChainId !== chain.id)
    throw new ChainMismatchError({ chain, currentChainId })
}
