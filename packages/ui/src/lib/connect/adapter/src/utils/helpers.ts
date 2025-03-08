import type { CaipNetworkId } from '@reown/appkit-common'
import { ConstantsUtil, PresetsUtil } from '@reown/appkit-utils'
import type { Hex } from 'vimina'

export function getEmailCaipNetworks() {
  return {
    supportsAllNetworks: true,
    approvedCaipNetworkIds: PresetsUtil.WalletConnectRpcChainIds.map(
      (id) => `${ConstantsUtil.EIP155}:${id}`,
    ) as CaipNetworkId[],
  }
}

export function requireCaipAddress(caipAddress: string) {
  if (!caipAddress) {
    throw new Error('No CAIP address provided')
  }
  const account = caipAddress.split(':')[2] as Hex
  if (!account) {
    throw new Error('Invalid CAIP address')
  }

  return account
}

export function parseWalletCapabilities(str: string) {
  try {
    return JSON.parse(str)
  } catch (_error) {
    throw new Error('Error parsing wallet capabilities')
  }
}
