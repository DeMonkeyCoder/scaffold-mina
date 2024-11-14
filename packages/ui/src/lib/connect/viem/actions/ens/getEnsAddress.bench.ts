import { beforeAll, bench, describe } from 'vitest'

import { ethersProvider } from '~test/src/bench'

import { anvilMainnet } from '../../../test/src/anvil'

import { reset } from '../test/reset'
import { getEnsAddress } from './getEnsAddress'

const client = anvilMainnet.getClient()

beforeAll(async () => {
  await reset(client, {
    blockNumber: 16773780n,
    jsonRpcUrl: anvilMainnet.forkUrl,
  })
})

describe('Get ENS Name', () => {
  bench('viem: `getEnsAddress`', async () => {
    await getEnsAddress(client, { name: 'awkweb.eth' })
  })

  bench('ethers: `resolveName`', async () => {
    await ethersProvider.resolveName('awkweb.eth')
  })
})
