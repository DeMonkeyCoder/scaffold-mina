import { bench, describe } from 'vitest'

import { ethersProvider } from '~test/src/bench'

import { anvilMainnet } from '../../../test/src/anvil'

import { getBlockNumber } from './getBlockNumber'

const client = anvilMainnet.getClient()

describe('Get Block Number', () => {
  bench('viem: `getBlockNumber`', async () => {
    await getBlockNumber(client)
  })

  bench('ethers: `getBlockNumber`', async () => {
    await ethersProvider.getBlockNumber()
  })
})
