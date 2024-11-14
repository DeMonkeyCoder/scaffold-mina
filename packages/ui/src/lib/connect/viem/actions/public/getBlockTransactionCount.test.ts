import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants'
import { anvilMainnet } from '../../../test/src/anvil'
import { parseEther } from '../../utils/unit/parseEther'
import { mine } from '../test/mine'
import { sendTransaction } from '../wallet/sendTransaction'

import { getBlock } from './getBlock'
import { getBlockTransactionCount } from './getBlockTransactionCount'

const client = anvilMainnet.getClient()

test('default', async () => {
  expect(await getBlockTransactionCount(client)).toBeDefined()
})

test('args: blockNumber', async () => {
  expect(
    await getBlockTransactionCount(client, {
      blockNumber: anvilMainnet.forkBlockNumber - 1n,
    }),
  ).toBe(124)
})

test('args: blockHash', async () => {
  const block = await getBlock(client, {
    blockNumber: anvilMainnet.forkBlockNumber - 1n,
  })
  expect(
    await getBlockTransactionCount(client, {
      blockHash: block.hash!,
    }),
  ).toBe(124)
})

test('args: blockTag', async () => {
  await mine(client, { blocks: 1 })
  expect(
    await getBlockTransactionCount(client, {
      blockTag: 'latest',
    }),
  ).toBe(0)
  await sendTransaction(client, {
    account: accounts[0].address,
    to: accounts[1].address,
    value: parseEther('1'),
  })
  await mine(client, { blocks: 1 })
  expect(
    await getBlockTransactionCount(client, {
      blockTag: 'latest',
    }),
  ).toBe(1)
})
