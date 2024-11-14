import type { Hash } from '../types/misc'

import { BaseError } from './base'

export type BlockNotFoundErrorType = BlockNotFoundError & {
  name: 'BlockNotFoundError'
}
export class BlockNotFoundError extends BaseError {
  constructor({
    blockHash,
    blockNumber,
  }: {
    blockHash?: Hash | undefined
    blockNumber?: bigint | undefined
  }) {
    let identifier = 'Block'
    if (blockHash) identifier = `Block at hash "${blockHash}"`
    if (blockNumber) identifier = `Block at number "${blockNumber}"`
    super(`${identifier} could not be found.`, { name: 'BlockNotFoundError' })
  }
}
