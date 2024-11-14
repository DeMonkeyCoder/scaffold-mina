import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { showCallsStatusMutationOptions } from './showCallsStatus'

test('default', () => {
  expect(showCallsStatusMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "showCallsStatus",
      ],
    }
  `)
})
