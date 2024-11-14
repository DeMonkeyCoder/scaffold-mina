import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { deployContractMutationOptions } from './deployContract'

test('default', () => {
  expect(deployContractMutationOptions(config)).toMatchInlineSnapshot(`
    {
      "mutationFn": [Function],
      "mutationKey": [
        "deployContract",
      ],
    }
  `)
})
