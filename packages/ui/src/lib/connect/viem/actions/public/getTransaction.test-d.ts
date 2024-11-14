import { describe, expectTypeOf, test } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'
import { optimism } from '../../chains/index'

import { createPublicClient } from '../../clients/createPublicClient'
import { http } from '../../clients/transports/http'
import type { Hex } from '../../types/misc'
import type {
  Transaction,
  TransactionEIP1559,
  TransactionEIP2930,
  TransactionEIP4844,
  TransactionLegacy,
} from '../../types/transaction'
import type { Prettify } from '../../types/utils'
import { getTransaction } from './getTransaction'

const client = anvilMainnet.getClient()

test('default', async () => {
  const transaction = await getTransaction(client, {
    hash: '0x',
  })
  expectTypeOf(transaction).toEqualTypeOf<Transaction<bigint, number, false>>()
  if (transaction.type === 'legacy')
    expectTypeOf(transaction).toEqualTypeOf<
      Prettify<TransactionLegacy<bigint, number, false>>
    >()
  if (transaction.type === 'eip1559')
    expectTypeOf(transaction).toEqualTypeOf<
      Prettify<TransactionEIP1559<bigint, number, false>>
    >()
  if (transaction.type === 'eip2930')
    expectTypeOf(transaction).toEqualTypeOf<
      Prettify<TransactionEIP2930<bigint, number, false>>
    >()
  if (transaction.type === 'eip4844')
    expectTypeOf(transaction).toEqualTypeOf<
      Prettify<TransactionEIP4844<bigint, number, false>>
    >()
})

test('blockTag = "latest"', async () => {
  const transaction = await getTransaction(client, {
    hash: '0x',
  })
  expectTypeOf(transaction.blockHash).toEqualTypeOf<Hex>()
  expectTypeOf(transaction.blockNumber).toEqualTypeOf<bigint>()
  expectTypeOf(transaction.transactionIndex).toEqualTypeOf<number>()
})

test('blockTag = "pending"', async () => {
  const transaction = await getTransaction(client, {
    blockTag: 'pending',
    index: 0,
  })
  expectTypeOf(transaction.blockHash).toEqualTypeOf<null>()
  expectTypeOf(transaction.blockNumber).toEqualTypeOf<null>()
  expectTypeOf(transaction.transactionIndex).toEqualTypeOf<null>()
})

describe('chain w/ formatter', () => {
  const client = createPublicClient({
    chain: optimism,
    transport: http(),
  })

  test('blockTag = "latest"', async () => {
    const transaction = await getTransaction(client, {
      hash: '0x',
    })
    expectTypeOf(transaction.blockHash).toEqualTypeOf<Hex>()
    expectTypeOf(transaction.blockNumber).toEqualTypeOf<bigint>()
    expectTypeOf(transaction.transactionIndex).toEqualTypeOf<number>()
  })

  test('blockTag = "pending"', async () => {
    const transaction = await getTransaction(client, {
      blockTag: 'pending',
      index: 0,
    })
    expectTypeOf(transaction.blockHash).toEqualTypeOf<null>()
    expectTypeOf(transaction.blockNumber).toEqualTypeOf<null>()
    expectTypeOf(transaction.transactionIndex).toEqualTypeOf<null>()
  })
})
