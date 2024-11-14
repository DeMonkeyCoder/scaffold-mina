import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants'
import { parseEther } from '../../utils/unit/parseEther'
import { wait } from '../../utils/wait'
import { mine } from '../test/mine'
import { sendTransaction } from '../wallet/sendTransaction'

import { anvilMainnet } from '../../../test/src/anvil'

import { getTransactionConfirmations } from './getTransactionConfirmations'
import { getTransactionReceipt } from './getTransactionReceipt'

const client = anvilMainnet.getClient()

test('default', async () => {
  const hash = await sendTransaction(client, {
    account: accounts[0].address,
    to: accounts[1].address,
    value: parseEther('1'),
  })
  await mine(client, { blocks: 1 })
  await wait(1000)
  const transactionReceipt = await getTransactionReceipt(client, {
    hash,
  })
  expect(
    await getTransactionConfirmations(client, {
      transactionReceipt,
    }),
  ).toBe(1n)
})

test('multiple confirmations', async () => {
  const hash = await sendTransaction(client, {
    account: accounts[0].address,
    to: accounts[1].address,
    value: parseEther('1'),
  })
  await mine(client, { blocks: 10 })
  const transactionReceipt = await getTransactionReceipt(client, {
    hash,
  })
  expect(
    await getTransactionConfirmations(client, {
      transactionReceipt,
    }),
  ).toBe(10n)
})

test('args: hash', async () => {
  const hash = await sendTransaction(client, {
    account: accounts[0].address,
    to: accounts[1].address,
    value: parseEther('1'),
  })
  await mine(client, { blocks: 10 })
  expect(
    await getTransactionConfirmations(client, {
      hash,
    }),
  ).toBe(10n)
})

test('no confirmations', async () => {
  const hash = await sendTransaction(client, {
    account: accounts[0].address,
    to: accounts[1].address,
    value: parseEther('1'),
  })
  expect(
    await getTransactionConfirmations(client, {
      hash,
    }),
  ).toBe(0n)
})
