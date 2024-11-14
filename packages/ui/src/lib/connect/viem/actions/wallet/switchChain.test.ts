import { expect, test } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'
import { avalanche, fantom } from '../../chains/index'

import { switchChain } from './switchChain'

const client = anvilMainnet.getClient()

test('default', async () => {
  await switchChain(client!, avalanche)
})

test('unsupported chain', async () => {
  await expect(switchChain(client!, fantom)).rejects.toMatchInlineSnapshot(
    '[Error: Unrecognized chain.]',
  )
})
