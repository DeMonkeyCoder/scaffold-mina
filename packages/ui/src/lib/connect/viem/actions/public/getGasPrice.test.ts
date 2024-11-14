import { expect, test } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'

import { getGasPrice } from './getGasPrice'

const client = anvilMainnet.getClient()

test('getGasPrice', async () => {
  expect(await getGasPrice(client)).toBeDefined()
})
