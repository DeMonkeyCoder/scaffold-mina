import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants'
import { signMessage } from '../../actions/wallet/signMessage'

import { anvilMainnet } from '../../../test/src/anvil'
import { hashMessage } from './hashMessage'
import { verifyHash } from './verifyHash'

const client = anvilMainnet.getClient()

test('default', async () => {
  let signature = await signMessage(client!, {
    account: accounts[0].address,
    message: 'hello world',
  })
  expect(
    await verifyHash({
      address: accounts[0].address,
      hash: hashMessage('hello world'),
      signature,
    }),
  ).toBeTruthy()

  signature = await signMessage(client!, {
    account: accounts[0].address,
    message: 'wagmi 🥵',
  })
  expect(
    await verifyHash({
      address: accounts[0].address,
      hash: hashMessage('wagmi 🥵'),
      signature,
    }),
  ).toBeTruthy()
})
