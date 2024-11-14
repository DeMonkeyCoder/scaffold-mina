import { config } from '@wagmi/test'
import { expect, test } from 'vitest'

import type { Connection } from '../createConfig'
import { connect } from './connect'
import { disconnect } from './disconnect'
import { watchConnections } from './watchConnections'

test('default', async () => {
  const connections: Connection[][] = []
  const unwatch = watchConnections(config, {
    onChange(connection) {
      connections.push(connection)
    },
  })

  const connector = config.connectors[0]!
  expect(connections).toEqual([])
  await connect(config, { connector })
  expect(connections[0]?.length).toEqual(1)
  await disconnect(config, { connector })
  expect(connections[1]).toEqual([])

  unwatch()
})
