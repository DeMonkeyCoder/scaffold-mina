import { expect, test } from 'vitest'

import { accounts, address } from '~test/src/constants'
import { parseEther } from '../../utils/unit/parseEther'
import { sendTransaction } from '../wallet/sendTransaction'

import { anvilMainnet } from '../../../test/src/anvil'
import { impersonateAccount } from './impersonateAccount'
import { stopImpersonatingAccount } from './stopImpersonatingAccount'

const client = anvilMainnet.getClient()

test('stops impersonating account', async () => {
  await impersonateAccount(client, { address: address.vitalik })

  expect(
    await sendTransaction(client, {
      account: address.vitalik,
      to: accounts[0].address,
      value: parseEther('1'),
    }),
  ).toBeDefined()

  await expect(
    stopImpersonatingAccount(client, { address: address.vitalik }),
  ).resolves.toBeUndefined()

  await expect(
    sendTransaction(client, {
      account: address.vitalik,
      to: accounts[0].address,
      value: parseEther('1'),
    }),
  ).rejects.toThrowError('No Signer available')
})
