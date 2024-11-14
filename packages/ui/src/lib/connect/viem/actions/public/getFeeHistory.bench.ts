import { bench, describe } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { getFeeHistory } from './getFeeHistory'

const client = anvilMainnet.getClient()

describe.skip('Get Fee History', () => {
  bench('viem: `getFeeHistory`', async () => {
    await getFeeHistory(client, {
      blockCount: 2,
      rewardPercentiles: [25, 75],
    })
  })
})
