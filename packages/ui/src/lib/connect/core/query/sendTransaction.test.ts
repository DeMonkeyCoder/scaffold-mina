import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { sendTransactionMutationOptions } from './sendTransaction'

test('default', () => {
  expect(sendTransactionMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "sendTransaction",
      ],
    }
  `)
})
