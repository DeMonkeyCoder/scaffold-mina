import { bench, describe } from 'vitest'

import { ethersProvider } from '~test/src/bench'
import { accounts } from '~test/src/constants'
import { parseEther } from '../../utils/unit/parseEther'

import { anvilMainnet } from '../../../test/src/anvil'

import { estimateGas } from './estimateGas'

const client = anvilMainnet.getClient()

describe.skip('Estimate Gas', () => {
  bench('viem: `estimateGas`', async () => {
    await estimateGas(client, {
      account: accounts[0].address,
      to: accounts[1].address,
      value: parseEther('1'),
    })
  })

  bench('ethers: `estimateGas`', async () => {
    await ethersProvider.estimateGas({
      from: accounts[0].address,
      to: accounts[1].address,
      value: parseEther('1'),
    })
  })
})
