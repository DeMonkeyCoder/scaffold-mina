import { bench, describe } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { getBlockTransactionCount } from './getBlockTransactionCount'

const client = anvilMainnet.getClient()

describe.skip('Get Block Transaction Count', () => {
  bench('viem: `getBlockTransactionCount`', async () => {
    await getBlockTransactionCount(client)
  })
})
