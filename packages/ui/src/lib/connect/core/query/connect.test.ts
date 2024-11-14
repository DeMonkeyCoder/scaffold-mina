import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { connectMutationOptions } from './connect'

test('default', () => {
  expect(connectMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "connect",
      ],
    }
  `)
})
