import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants'

import { anvilOptimism } from '../../../test/src/anvil'
import { type TransactionRequestEIP1559, parseGwei } from '../../index'
import { parseEther } from '../../utils/unit/parseEther'
import { estimateTotalFee } from './estimateTotalFee'

const optimismClient = anvilOptimism.getClient()
const optimismClientWithAccount = anvilOptimism.getClient({ account: true })
const optimismClientWithoutChain = anvilOptimism.getClient({ chain: false })

const baseTransaction = {
  maxFeePerGas: parseGwei('100'),
  maxPriorityFeePerGas: parseGwei('1'),
  to: accounts[1].address,
  value: parseEther('0.1'),
} as const satisfies Omit<TransactionRequestEIP1559, 'from'>

test('default', async () => {
  const fee = await estimateTotalFee(optimismClientWithAccount, baseTransaction)
  expect(fee).toBeDefined()
})

test('minimal', async () => {
  const fee = await estimateTotalFee(optimismClientWithAccount, {})
  expect(fee).toBeDefined()
})

test('args: account', async () => {
  const fee = await estimateTotalFee(optimismClient, {
    ...baseTransaction,
    account: accounts[0].address,
  })
  expect(fee).toBeDefined()
})

test('args: data', async () => {
  const fee = await estimateTotalFee(optimismClientWithAccount, {
    ...baseTransaction,
    data: '0x00000000000000000000000000000000000000000000000004fefa17b7240000',
  })
  expect(fee).toBeDefined()
})

test('args: feePriceOracleAddress', async () => {
  const fee = await estimateTotalFee(optimismClientWithAccount, {
    ...baseTransaction,
    gasPriceOracleAddress: '0x420000000000000000000000000000000000000F',
  })
  expect(fee).toBeDefined()
})

test('args: nonce', async () => {
  const fee = await estimateTotalFee(optimismClientWithAccount, {
    ...baseTransaction,
    nonce: 69,
  })
  expect(fee).toBeDefined()
})

test('args: nullish chain', async () => {
  const fee = await estimateTotalFee(optimismClientWithoutChain, {
    ...baseTransaction,
    account: accounts[0].address,
    chain: null,
  })
  expect(fee).toBeDefined()
})
