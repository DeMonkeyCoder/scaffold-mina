import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { switchAccountMutationOptions } from './switchAccount'

test('default', () => {
  expect(switchAccountMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "switchAccount",
      ],
    }
  `)
})
