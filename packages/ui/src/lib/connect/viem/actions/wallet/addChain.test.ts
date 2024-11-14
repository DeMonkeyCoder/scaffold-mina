import { test } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'
import { avalanche } from '../../chains/index'

import { addChain } from './addChain'

const client = anvilMainnet.getClient()

test('default', async () => {
  await addChain(client!, { chain: avalanche })
})

test('no block explorer', async () => {
  await addChain(client!, {
    chain: { ...avalanche, blockExplorers: undefined },
  })
})
