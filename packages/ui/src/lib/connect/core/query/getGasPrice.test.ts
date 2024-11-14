import { chain, config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { getGasPriceQueryOptions } from './getGasPrice'

test('default', () => {
  expect(getGasPriceQueryOptions(config)).toMatchInlineSnapshot(`
    {
      "queryFn": [Function],
      "queryKey": [
        "gasPrice",
        {},
      ],
    }
  `)
})

test('parameters: chainId', () => {
  expect(
    getGasPriceQueryOptions(config, { chainId: chain.mainnet.id }),
  ).toMatchInlineSnapshot(`
    {
      "queryFn": [Function],
      "queryKey": [
        "gasPrice",
        {
          "chainId": 1,
        },
      ],
    }
  `)
})
