import { expect, test } from 'vitest'

import { getBlock } from '../public/getBlock'

import { anvilMainnet } from '../../../test/src/anvil'

import { increaseTime } from './increaseTime'
import { mine } from './mine'

const client = anvilMainnet.getClient()

// TODO: Anvil seems to not register the increased timestamp sometimes.
test.skip('increases time', async () => {
  const block1 = await getBlock(client, {
    blockTag: 'latest',
  })
  await increaseTime(client, { seconds: 86400 })
  await mine(client, { blocks: 1 })
  const block2 = await getBlock(client, { blockTag: 'latest' })
  expect(block2.timestamp).toBeGreaterThan(block1.timestamp + (86400n - 1000n))
})
