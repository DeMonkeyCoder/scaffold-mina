import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { connect } from './connect'
import { disconnect } from './disconnect'
import { getConnections } from './getConnections'

test('default', async () => {
  const connector = config.connectors[0]!
  expect(getConnections(config)).toEqual([])
  await connect(config, { connector })
  expect(getConnections(config).length).toEqual(1)
  await disconnect(config, { connector })
  expect(getConnections(config)).toEqual([])
})
