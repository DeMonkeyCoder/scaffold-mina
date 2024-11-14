import { expect, test } from 'vitest'

import { getVersion } from './getVersion'

test('default', () => {
  expect(getVersion()).toMatchInlineSnapshot(`"wagmi@x.y.z"`)
})
