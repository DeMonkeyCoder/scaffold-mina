import { expect, test } from 'vitest'

import * as internal from './internal'

test('exports', () => {
  expect(Object.keys(internal)).toMatchInlineSnapshot(`
    [
      "watchChains",
      "Emitter",
      "createEmitter",
      "deepEqual",
      "uid",
    ]
  `)
})
