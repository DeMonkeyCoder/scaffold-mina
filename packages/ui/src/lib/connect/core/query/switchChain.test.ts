import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { switchChainMutationOptions } from './switchChain'

test('default', () => {
  expect(switchChainMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "switchChain",
      ],
    }
  `)
})
