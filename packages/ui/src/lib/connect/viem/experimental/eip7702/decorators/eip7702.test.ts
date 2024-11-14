import { describe, expect, test } from 'vitest'

import { anvilMainnet } from '../../../../test/src/anvil'
import { accounts } from '../../../../test/src/constants'
import { privateKeyToAccount } from '../../../accounts/privateKeyToAccount'
import { eip7702Actions } from './eip7702'

const client = anvilMainnet
  .getClient({ account: privateKeyToAccount(accounts[0].privateKey) })
  .extend(eip7702Actions())

test('default', async () => {
  expect(eip7702Actions()(client)).toMatchInlineSnapshot(`
    {
      "signAuthorization": [Function],
    }
  `)
})

describe('smoke test', () => {
  test('getCapabilities', async () => {
    await client.signAuthorization({
      contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    })
  })
})
