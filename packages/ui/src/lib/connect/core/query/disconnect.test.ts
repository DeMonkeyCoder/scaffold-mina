import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { disconnectMutationOptions } from './disconnect'

test('default', () => {
  expect(disconnectMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "disconnect",
      ],
    }
  `)
})
