import { expect, test } from 'vitest'
import {
  mockBaseTokenL1Address,
  mockClientPublicActionsL2,
  zksyncClientLocalNode,
} from '../../../test/src/zksync'

import { getBaseTokenL1Address } from './getBaseTokenL1Address'

const client = { ...zksyncClientLocalNode }

mockClientPublicActionsL2(client)

test('default', async () => {
  const address = await getBaseTokenL1Address(client)
  expect(address).to.equal(mockBaseTokenL1Address)
})
