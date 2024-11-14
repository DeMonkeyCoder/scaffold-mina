import type { Hex } from './misc'

export type Withdrawal = {
  address: Hex
  amount: Hex
  index: Hex
  validatorIndex: Hex
}
