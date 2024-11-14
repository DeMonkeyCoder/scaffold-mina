import { bench, describe } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { createPendingTransactionFilter } from './createPendingTransactionFilter'

const client = anvilMainnet.getClient()

describe.skip('Create Pending Transaction Filter', () => {
  bench('viem: `createPendingTransactionFilter`', async () => {
    await createPendingTransactionFilter(client)
  })
})
