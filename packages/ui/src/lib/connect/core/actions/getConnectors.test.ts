import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { getConnectors } from './getConnectors'

test('default', () => {
  expect(getConnectors(config)).toEqual(config.connectors)
})
