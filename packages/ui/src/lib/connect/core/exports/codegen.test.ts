import { expect, test } from 'vitest'

import * as codegen from './codegen'

test('exports', () => {
  expect(Object.keys(codegen)).toMatchInlineSnapshot(`
    [
      "createSimulateContract",
      "createReadContract",
      "createWatchContractEvent",
      "createWriteContract",
    ]
  `)
})
