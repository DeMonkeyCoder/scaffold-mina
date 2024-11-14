import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { waitForTransactionReceiptQueryOptions } from './waitForTransactionReceipt'

test('default', () => {
  expect(
    waitForTransactionReceiptQueryOptions(config, {}),
  ).toMatchInlineSnapshot(`
    {
      "queryFn": [Function],
      "queryKey": [
        "waitForTransactionReceipt",
        {},
      ],
    }
  `)
})
