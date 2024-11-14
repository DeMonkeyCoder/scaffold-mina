import { bench, describe } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { createBlockFilter } from './createBlockFilter'

const client = anvilMainnet.getClient()

describe.skip('Create Block Filter', () => {
  bench('viem: `createBlockFilter`', async () => {
    await createBlockFilter(client)
  })
})
