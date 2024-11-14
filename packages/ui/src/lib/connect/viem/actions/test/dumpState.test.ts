import { expect, test } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil'
import { dumpState } from './dumpState'

const client = anvilMainnet.getClient()

test('dumps state', async () => {
  expect(await dumpState(client)).toBeDefined()
})
