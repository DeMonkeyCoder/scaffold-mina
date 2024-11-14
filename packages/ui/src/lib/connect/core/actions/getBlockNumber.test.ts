import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { getBlockNumber } from './getBlockNumber'

test('default', async () => {
  await expect(getBlockNumber(config)).resolves.toBeDefined()
})
