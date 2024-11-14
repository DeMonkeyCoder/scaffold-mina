import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { signTypedDataMutationOptions } from './signTypedData'

test('default', () => {
  expect(signTypedDataMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "signTypedData",
      ],
    }
  `)
})
