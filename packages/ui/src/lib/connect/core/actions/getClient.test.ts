import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { getClient } from './getClient'

test('default', () => {
  expect(getClient(config)).toBeDefined()
})

test('behavior: unconfigured chain', () => {
  expect(
    getClient(config, {
      // @ts-expect-error
      chainId: 123456,
    }),
  ).toBeUndefined()
})
