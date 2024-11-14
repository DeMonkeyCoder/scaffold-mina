import { expectTypeOf, test } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'
import type { Account } from '../../types/account'
import {
  type SoladySmartAccountImplementation,
  toSoladySmartAccount,
} from './implementations/toSoladySmartAccount'
import type { SmartAccount } from './types'

const client = anvilMainnet.getClient()

test('default', async () => {
  const account = await toSoladySmartAccount({
    client,
    owner: '0x',
  })

  // Matches generic Account.
  expectTypeOf(account).toMatchTypeOf<Account>()

  // Matches generic SmartAccount.
  expectTypeOf(account).toMatchTypeOf<SmartAccount>()

  // Matches narrowed Smart Account.
  expectTypeOf(account).toMatchTypeOf<
    SmartAccount<SoladySmartAccountImplementation>
  >()
})
