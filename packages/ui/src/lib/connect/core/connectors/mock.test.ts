import { accounts, config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { mock } from './mock'

test('setup', () => {
  const connectorFn = mock({ accounts })
  const connector = config._internal.connectors.setup(connectorFn)
  expect(connector.name).toEqual('Mock Connector')
})
