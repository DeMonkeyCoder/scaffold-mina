import { expect, test } from 'vitest'

import { accounts, address } from '~test/src/constants'
import { celo } from '../../chains/index'
import { createTestClient } from '../../clients/createTestClient'
import { defineChain } from '../../utils/chain/defineChain'
import { parseEther } from '../../utils/unit/parseEther'
import { getBalance } from '../public/getBalance'

import { anvilMainnet } from '../../../test/src/anvil'
import { http } from '../../index'
import { mine } from './mine'
import { sendUnsignedTransaction } from './sendUnsignedTransaction'
import { setBalance } from './setBalance'

const client = anvilMainnet.getClient()

const sourceAccount = {
  address: address.vitalik,
} as const
const targetAccount = accounts[9]

test('sends unsigned transaction', async () => {
  await setBalance(client, {
    address: targetAccount.address,
    value: targetAccount.balance,
  })
  await setBalance(client, {
    address: sourceAccount.address,
    value: parseEther('10000'),
  })

  const balance = await getBalance(client, {
    address: sourceAccount.address,
  })

  expect(
    await sendUnsignedTransaction(client, {
      from: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther('1'),
    }),
  ).toBeDefined()

  expect(
    await getBalance(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot('10000000000000000000000n')
  expect(
    await getBalance(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot('10000000000000000000000n')

  await mine(client, { blocks: 1 })

  expect(
    await getBalance(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot('10001000000000000000000n')
  expect(
    await getBalance(client, { address: sourceAccount.address }),
  ).toBeLessThan(balance)
})

test('sends unsigned transaction (w/ formatter)', async () => {
  const chain = defineChain({
    ...client.chain,
    formatters: {
      transactionRequest: celo.formatters.transactionRequest,
    },
    serializers: undefined,
  })
  const testClient2 = createTestClient({
    chain,
    mode: 'anvil',
    transport: http(),
  })

  await setBalance(testClient2, {
    address: targetAccount.address,
    value: targetAccount.balance,
  })
  await setBalance(testClient2, {
    address: sourceAccount.address,
    value: parseEther('10000'),
  })

  const balance = await getBalance(client, {
    address: sourceAccount.address,
  })

  expect(
    await sendUnsignedTransaction(testClient2, {
      from: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther('1'),
    }),
  ).toBeDefined()

  expect(
    await getBalance(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot('10000000000000000000000n')
  expect(
    await getBalance(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot('10000000000000000000000n')

  await mine(testClient2, { blocks: 1 })

  expect(
    await getBalance(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot('10001000000000000000000n')
  expect(
    await getBalance(client, { address: sourceAccount.address }),
  ).toBeLessThan(balance)
})
