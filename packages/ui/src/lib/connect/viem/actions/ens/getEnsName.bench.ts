import { beforeAll, bench, describe } from 'vitest'

import { ethersProvider } from '~test/src/bench'

import { anvilMainnet } from '../../../test/src/anvil'

import { reset } from '../test/reset'
import { getEnsName } from './getEnsName'

const client = anvilMainnet.getClient()

beforeAll(async () => {
  await reset(client, {
    blockNumber: 16773780n,
    jsonRpcUrl: anvilMainnet.forkUrl,
  })
})

describe('Get ENS Name', () => {
  bench('viem: `getEnsName`', async () => {
    await getEnsName(client, {
      address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    })
  })

  bench('ethers: `lookupAddress`', async () => {
    await ethersProvider.lookupAddress(
      '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    )
  })
})
