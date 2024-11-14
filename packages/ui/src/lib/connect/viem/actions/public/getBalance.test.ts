import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants'
import { parseEther } from '../../utils/unit/parseEther'
import { mine } from '../test/mine'
import { setBalance } from '../test/setBalance'
import { sendTransaction } from '../wallet/sendTransaction'

import { anvilMainnet } from '../../../test/src/anvil'

import { getBalance } from './getBalance'
import { getBlockNumber } from './getBlockNumber'

const client = anvilMainnet.getClient()

const sourceAccount = accounts[0]
const targetAccount = accounts[1]

async function setup() {
  await setBalance(client, {
    address: targetAccount.address,
    value: targetAccount.balance,
  })
  await mine(client, { blocks: 1 })
  await sendTransaction(client, {
    account: sourceAccount.address,
    to: targetAccount.address,
    value: parseEther('1'),
  })
  await mine(client, { blocks: 1 })
  await sendTransaction(client, {
    account: sourceAccount.address,
    to: targetAccount.address,
    value: parseEther('2'),
  })
  await mine(client, { blocks: 1 })
  await sendTransaction(client, {
    account: sourceAccount.address,
    to: targetAccount.address,
    value: parseEther('3'),
  })
  await mine(client, { blocks: 1 })
}

test('gets balance', async () => {
  await setup()
  expect(
    await getBalance(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot('10006000000000000000000n')
})

test('gets balance at latest', async () => {
  await setup()
  expect(
    await getBalance(client, {
      address: targetAccount.address,
      blockTag: 'latest',
    }),
  ).toMatchInlineSnapshot('10006000000000000000000n')
})

test('gets balance at block number', async () => {
  await setup()
  const currentBlockNumber = await getBlockNumber(client)
  expect(
    await getBalance(client, {
      address: targetAccount.address,
      blockNumber: currentBlockNumber,
    }),
  ).toMatchInlineSnapshot('10006000000000000000000n')
  expect(
    await getBalance(client, {
      address: targetAccount.address,
      blockNumber: currentBlockNumber - 1n,
    }),
  ).toMatchInlineSnapshot('10003000000000000000000n')
  expect(
    await getBalance(client, {
      address: targetAccount.address,
      blockNumber: currentBlockNumber - 2n,
    }),
  ).toMatchInlineSnapshot('10001000000000000000000n')
  expect(
    await getBalance(client, {
      address: targetAccount.address,
      blockNumber: currentBlockNumber - 3n,
    }),
  ).toMatchInlineSnapshot('10000000000000000000000n')
})
