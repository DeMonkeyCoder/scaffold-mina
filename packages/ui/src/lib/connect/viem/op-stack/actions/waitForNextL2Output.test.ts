import { expect, test } from 'vitest'
import { mainnetClient } from '../../../test/src/utils'
import { optimism } from '../../chains/index'
import { waitForNextL2Output } from './waitForNextL2Output'

test('default', async () => {
  const output = await waitForNextL2Output(mainnetClient, {
    l2BlockNumber: 19494651n,
    targetChain: optimism,
  })
  expect(output).toBeDefined()
}, 20_000)
