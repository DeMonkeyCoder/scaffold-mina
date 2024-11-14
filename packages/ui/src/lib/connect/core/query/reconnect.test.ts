import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { reconnectMutationOptions } from './reconnect'

test('default', () => {
  expect(reconnectMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "reconnect",
      ],
    }
  `)
})
