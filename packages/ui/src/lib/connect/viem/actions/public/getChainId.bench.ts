import { bench, describe } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { getChainId } from './getChainId'

const client = anvilMainnet.getClient()

describe.skip('Get Chain ID', () => {
  bench('viem: `getChainId`', async () => {
    await getChainId(client)
  })
})
