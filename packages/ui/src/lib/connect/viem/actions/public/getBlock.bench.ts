import { bench, describe } from 'vitest'

import { ethersProvider } from '~test/src/bench'

import { anvilMainnet } from '../../../test/src/anvil'

import { getBlock } from './getBlock'

const client = anvilMainnet.getClient()

describe('Get Block', () => {
  bench('viem: `getBlock`', async () => {
    await getBlock(client)
  })

  bench('ethers: `getBlock`', async () => {
    await ethersProvider.getBlock('latest')
  })
})
