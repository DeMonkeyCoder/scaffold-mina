import type { Address } from '../../accounts/index'
import {
  ethAddressInContracts,
  l2BaseTokenAddress,
  legacyEthAddress,
} from '../constants/address'

export function isEth(token: Address) {
  return (
    token.localeCompare(legacyEthAddress, undefined, {
      sensitivity: 'accent',
    }) === 0 ||
    token.localeCompare(l2BaseTokenAddress, undefined, {
      sensitivity: 'accent',
    }) === 0 ||
    token.localeCompare(ethAddressInContracts, undefined, {
      sensitivity: 'accent',
    }) === 0
  )
}
