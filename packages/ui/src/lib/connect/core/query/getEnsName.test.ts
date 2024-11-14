import { chain, config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { getEnsNameQueryOptions } from './getEnsName.js'

test('default', () => {
  expect(getEnsNameQueryOptions(config)).toMatchInlineSnapshot(`
    {
      "queryFn": [Function],
      "queryKey": [
        "ensName",
        {},
      ],
    }
  `)
})

test('parameters: chainId', () => {
  expect(
    getEnsNameQueryOptions(config, { chainId: chain.mainnet.id }),
  ).toMatchInlineSnapshot(`
    {
      "queryFn": [Function],
      "queryKey": [
        "ensName",
        {
          "chainId": 1,
        },
      ],
    }
  `)
})
