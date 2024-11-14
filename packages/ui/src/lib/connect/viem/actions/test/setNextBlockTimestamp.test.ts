import { expect, test } from 'vitest'

import { getBlock } from '../public/getBlock'

import { anvilMainnet } from '../../../test/src/anvil'

import { mine } from './mine'
import { setNextBlockTimestamp } from './setNextBlockTimestamp'

const client = anvilMainnet.getClient()

test('sets block timestamp interval', async () => {
  await mine(client, { blocks: 1 })

  const block1 = await getBlock(client, {
    blockTag: 'latest',
  })
  await expect(
    setNextBlockTimestamp(client, {
      timestamp: block1.timestamp + 86400n,
    }),
  ).resolves.toBeUndefined()

  await mine(client, { blocks: 1 })

  const block2 = await getBlock(client, { blockTag: 'latest' })
  expect(block2.timestamp).toEqual(block1.timestamp + 86400n)
})
