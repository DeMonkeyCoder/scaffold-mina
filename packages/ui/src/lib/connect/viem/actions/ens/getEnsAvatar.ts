import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { ErrorType } from '../../errors/utils'
import type { Chain } from '../../types/chain'
import type { AssetGatewayUrls } from '../../types/ens'
import type { Prettify } from '../../types/utils'
import {
  type ParseAvatarRecordErrorType,
  parseAvatarRecord,
} from '../../utils/ens/avatar/parseAvatarRecord'
import { getAction } from '../../utils/getAction'

import {
  type GetEnsTextErrorType,
  type GetEnsTextParameters,
  getEnsText,
} from './getEnsText'

export type GetEnsAvatarParameters = Prettify<
  Omit<GetEnsTextParameters, 'key'> & {
    /** Gateway urls to resolve IPFS and/or Arweave assets. */
    assetGatewayUrls?: AssetGatewayUrls | undefined
  }
>

export type GetEnsAvatarReturnType = string | null

export type GetEnsAvatarErrorType =
  | GetEnsTextErrorType
  | ParseAvatarRecordErrorType
  | ErrorType

/**
 * Gets the avatar of an ENS name.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
 *
 * Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.
 *
 * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsAvatarParameters}
 * @returns Avatar URI or `null` if not found. {@link GetEnsAvatarReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsAvatar, normalize } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const ensAvatar = await getEnsAvatar(client, {
 *   name: normalize('wevm.eth'),
 * })
 * // 'https://ipfs.io/ipfs/Qma8mnp6xV3J2cRNf3mTth5C8nV11CAnceVinc3y8jSbio'
 */
export async function getEnsAvatar<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  {
    blockNumber,
    blockTag,
    assetGatewayUrls,
    name,
    gatewayUrls,
    strict,
    universalResolverAddress,
  }: GetEnsAvatarParameters,
): Promise<GetEnsAvatarReturnType> {
  const record = await getAction(
    client,
    getEnsText,
    'getEnsText',
  )({
    blockNumber,
    blockTag,
    key: 'avatar',
    name,
    universalResolverAddress,
    gatewayUrls,
    strict,
  })
  if (!record) return null
  try {
    return await parseAvatarRecord(client, {
      record,
      gatewayUrls: assetGatewayUrls,
    })
  } catch {
    return null
  }
}
