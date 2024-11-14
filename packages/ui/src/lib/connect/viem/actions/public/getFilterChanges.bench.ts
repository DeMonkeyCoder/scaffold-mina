import { bench, describe } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { createPendingTransactionFilter } from './createPendingTransactionFilter'
import { getFilterChanges } from './getFilterChanges'

const client = anvilMainnet.getClient()

const filter = await createPendingTransactionFilter(client)

describe.skip('Get Filter Changes', () => {
  bench('viem: `getFilterChanges`', async () => {
    await getFilterChanges(client, { filter })
  })
})
