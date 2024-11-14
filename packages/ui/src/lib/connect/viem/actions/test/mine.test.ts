import { expect, test } from 'vitest'

import { getBlockNumber } from '../public/getBlockNumber'

import { anvilMainnet } from '../../../test/src/anvil'

import { mine } from './mine'

const client = anvilMainnet.getClient()

test('mines 1 block', async () => {
  const currentBlockNumber = await getBlockNumber(client, {
    cacheTime: 0,
  })
  await expect(mine(client, { blocks: 1 })).resolves.toBeUndefined()
  const nextBlockNumber = await getBlockNumber(client, { cacheTime: 0 })
  expect(nextBlockNumber).toEqual(currentBlockNumber + 1n)
})

test('mines 5 blocks', async () => {
  const currentBlockNumber = await getBlockNumber(client, {
    cacheTime: 0,
  })
  await mine(client, { blocks: 5 })
  const nextBlockNumber = await getBlockNumber(client, { cacheTime: 0 })
  expect(nextBlockNumber).toEqual(currentBlockNumber + 5n)
})
