import { expect, test } from 'vitest'
import { anvilMainnet } from '../../../test/src/anvil'

import { getBlobBaseFee } from './getBlobBaseFee'

const client = anvilMainnet.getClient()

test('default', async () => {
  const baseFee = await getBlobBaseFee(client)
  expect(baseFee).toMatchInlineSnapshot('1n')
})
