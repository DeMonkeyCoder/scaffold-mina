import { bench, describe } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { createPendingTransactionFilter } from './createPendingTransactionFilter'
import { uninstallFilter } from './uninstallFilter'

const client = anvilMainnet.getClient()

const filter = await createPendingTransactionFilter(client)

describe.skip('Uninstall Filter', () => {
  bench('viem: `uninstallFilter`', async () => {
    await uninstallFilter(client, { filter })
  })
})
