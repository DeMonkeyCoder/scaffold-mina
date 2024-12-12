import type { Address } from '@/lib/connect/viem'

import type { HDKey } from '../types/account'
import type { Hex } from '../types/misc'
import type { OneOf, Prettify } from '../types/utils'
import type { NonceManager } from '../utils/nonceManager'

export type Account<address extends Address = Address> = OneOf<
  JsonRpcAccount<address> | LocalAccount<string, address>
>

///////////////////////////////////////////////////////////////////////////////////////////////////
// Sources
///////////////////////////////////////////////////////////////////////////////////////////////////

export type AccountSource = Address | CustomSource
export type CustomSource = {
  address: Address
  nonceManager?: NonceManager | undefined
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Accounts
///////////////////////////////////////////////////////////////////////////////////////////////////

export type JsonRpcAccount<address extends Address = Address> = {
  address: address
  type: 'json-rpc'
}

export type LocalAccount<
  source extends string = string,
  address extends Address = Address,
> = Prettify<
  CustomSource & {
    address: address
    publicKey: Hex
    source: source
    type: 'local'
  }
>

export type HDAccount = Prettify<
  LocalAccount<'hd'> & {
    getHdKey(): HDKey
  }
>

export type HDOptions =
  | {
      /** The account index to use in the path (`"m/44'/60'/${accountIndex}'/0/0"`). */
      accountIndex?: number | undefined
      /** The address index to use in the path (`"m/44'/60'/0'/0/${addressIndex}"`). */
      addressIndex?: number | undefined
      /** The change index to use in the path (`"m/44'/60'/0'/${changeIndex}/0"`). */
      changeIndex?: number | undefined
      path?: undefined
    }
  | {
      accountIndex?: undefined
      addressIndex?: undefined
      changeIndex?: undefined
      /** The HD path. */
      path: `m/44'/60'/${string}`
    }

export type PrivateKeyAccount = Prettify<LocalAccount<'privateKey'>>
