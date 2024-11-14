import { expect, test } from 'vitest'

import { wait } from '../../utils/wait'
import { getBlock } from '../public/getBlock'

import { anvilMainnet } from '../../../test/src/anvil'

import { mine } from './mine'
import { removeBlockTimestampInterval } from './removeBlockTimestampInterval'
import { setBlockTimestampInterval } from './setBlockTimestampInterval'

const client = anvilMainnet.getClient()

test('removes block timestamp interval', async () => {
  let interval = 86400
  await expect(
    setBlockTimestampInterval(client, { interval }),
  ).resolves.toBeUndefined()
  const block1 = await getBlock(client, { blockTag: 'latest' })
  await mine(client, { blocks: 1 })
  await wait(200)
  const block2 = await getBlock(client, { blockTag: 'latest' })
  expect(block2.timestamp).toEqual(block1.timestamp + BigInt(interval))

  await removeBlockTimestampInterval(client)
  interval = 1
  await mine(client, { blocks: 1 })
  await wait(200)
  const block3 = await getBlock(client, { blockTag: 'latest' })
  expect(block3.timestamp).toEqual(block2.timestamp + BigInt(interval))
})
