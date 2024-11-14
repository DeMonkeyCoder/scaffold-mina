import { expect, test } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { getChainId } from './getChainId'

const client = anvilMainnet.getClient()

test('default', async () => {
  expect(await getChainId(client)).toBe(1)
})
