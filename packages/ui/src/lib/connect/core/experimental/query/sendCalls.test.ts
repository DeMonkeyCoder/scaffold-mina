import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { sendCallsMutationOptions } from './sendCalls'

test('default', () => {
  expect(sendCallsMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "sendCalls",
      ],
    }
  `)
})
