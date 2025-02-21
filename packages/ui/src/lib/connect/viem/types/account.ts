import type { Address } from '@/lib/connect/viem'

import type { Account, JsonRpcAccount } from '../accounts/types'
import type { IsUndefined, MaybeRequired, Prettify } from './utils'

export type DeriveAccount<
  account extends Account | undefined,
  accountOverride extends Account | Address | undefined,
> = accountOverride extends Account | Address ? accountOverride : account

export type GetAccountParameter<
  account extends Account | undefined = Account | undefined,
  accountOverride extends Account | Address | undefined = Account | Address,
  required extends boolean = true,
  nullish extends boolean = false,
> = MaybeRequired<
  {
    account?:
      | accountOverride
      | Account
      | Address
      | (nullish extends true ? null : never)
      | undefined
  },
  IsUndefined<account> extends true
    ? required extends true
      ? true
      : false
    : false
>

export type ParseAccount<
  accountOrAddress extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
> = accountOrAddress extends Address
  ? Prettify<JsonRpcAccount<accountOrAddress>>
  : accountOrAddress

export type { Account } from '../accounts/types'
export type { HDKey } from '@scure/bip32'
