import { type ToHexErrorType, toHex } from '../utils/encoding/toHex'

import type { ErrorType } from '../errors/utils'
import type { HDKey } from '../types/account'
import {
  type PrivateKeyToAccountErrorType,
  type PrivateKeyToAccountOptions,
  privateKeyToAccount,
} from './privateKeyToAccount'
import type { HDAccount, HDOptions } from './types'

export type HDKeyToAccountOptions = HDOptions & PrivateKeyToAccountOptions

export type HDKeyToAccountErrorType =
  | PrivateKeyToAccountErrorType
  | ToHexErrorType
  | ErrorType

/**
 * @description Creates an Account from a HD Key.
 *
 * @returns A HD Account.
 */
export function hdKeyToAccount(
  hdKey_: HDKey,
  {
    accountIndex = 0,
    addressIndex = 0,
    changeIndex = 0,
    path,
    ...options
  }: HDKeyToAccountOptions = {},
): HDAccount {
  const hdKey = hdKey_.derive(
    path || `m/44'/60'/${accountIndex}'/${changeIndex}/${addressIndex}`,
  )
  const account = privateKeyToAccount(toHex(hdKey.privateKey!), options)
  return {
    ...account,
    getHdKey: () => hdKey,
    source: 'hd',
  }
}
