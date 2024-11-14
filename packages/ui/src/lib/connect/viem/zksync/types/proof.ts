import type { Hash } from '../../types/misc'

export type MessageProof = {
  id: number
  proof: Hash[]
  root: Hash
}
