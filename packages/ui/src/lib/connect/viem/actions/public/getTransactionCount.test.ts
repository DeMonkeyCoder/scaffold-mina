import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants'
import { parseEther } from '../../utils/unit/parseEther'
import { mine } from '../test/mine'
import { setNonce } from '../test/setNonce'
import { sendTransaction } from '../wallet/sendTransaction'

import { anvilMainnet } from '../../../test/src/anvil'

import { getTransactionCount } from './getTransactionCount'

const client = anvilMainnet.getClient()

test('gets transaction count', async () => {
  await setNonce(client, { address: accounts[0].address, nonce: 0 })
  await mine(client, { blocks: 1 })

  expect(
    await getTransactionCount(client, {
      address: accounts[0].address,
    }),
  ).toBe(0)

  await sendTransaction(client, {
    account: accounts[0].address,
    to: accounts[0].address,
    value: parseEther('1'),
  })
  await mine(client, { blocks: 1 })

  expect(
    await getTransactionCount(client, {
      address: accounts[0].address,
    }),
  ).toBe(1)
})

test('args: blockNumber', async () => {
  expect(
    await getTransactionCount(client, {
      address: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
      blockNumber: 14932234n,
    }),
  ).toBe(368)
})

test('args: blockTag', async () => {
  expect(
    await getTransactionCount(client, {
      address: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
      blockTag: 'latest',
    }),
  ).toBe(662)
})

test('no count', async () => {
  expect(
    await getTransactionCount(client, {
      address: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ad',
    }),
  ).toBe(0)
})
