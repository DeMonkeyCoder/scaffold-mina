import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants'
import { anvilMainnet } from '../../../test/src/anvil'
import { parseEther } from '../../utils/unit/parseEther'
import { sendTransaction } from '../wallet/sendTransaction'

import { getTxpoolContent } from './getTxpoolContent'
import { mine } from './mine'

const client = anvilMainnet.getClient()

test('gets txpool content (empty)', async () => {
  await mine(client, { blocks: 1 })

  expect(await getTxpoolContent(client)).toMatchInlineSnapshot(`
    {
      "pending": {},
      "queued": {},
    }
  `)
})

test('gets txpool content (pending)', async () => {
  await sendTransaction(client, {
    account: accounts[0].address,
    to: accounts[1].address,
    value: parseEther('2'),
  })
  await sendTransaction(client, {
    account: accounts[2].address,
    to: accounts[3].address,
    value: parseEther('3'),
  })
  const content1 = await getTxpoolContent(client)
  expect(Object.values(content1.pending).length).toBe(2)
  expect(Object.values(content1.queued).length).toBe(0)
  expect(content1.pending[accounts[0].address]).toBeDefined()
  expect(content1.pending[accounts[2].address]).toBeDefined()

  await mine(client, { blocks: 1 })

  const content2 = await getTxpoolContent(client)
  expect(Object.values(content2.pending).length).toBe(0)
  expect(Object.values(content2.queued).length).toBe(0)
  expect(content2.pending[accounts[0].address]).toBeUndefined()
  expect(content2.pending[accounts[2].address]).toBeUndefined()
})
