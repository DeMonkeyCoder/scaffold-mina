import { expect, test } from 'vitest'

import * as utils from './utils'

test('exports', () => {
  expect(Object.keys(utils)).toMatchInlineSnapshot(`
    [
      "assertCurrentChain",
      "defineChain",
      "extractChain",
      "getChainContractAddress",
    ]
  `)
})
