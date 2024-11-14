import { accounts, config } from '@wagmi/test'
import { expect, test } from 'vitest'

import { mock } from '../connectors/mock'
import type { Connector } from '../createConfig'
import { watchConnectors } from './watchConnectors'

test('default', async () => {
  const connectors: (readonly Connector[])[] = []
  const unwatch = watchConnectors(config, {
    onChange(connector) {
      connectors.push(connector)
    },
  })

  const count = config.connectors.length
  expect(config.connectors).toEqual(config.connectors)

  config._internal.connectors.setState(() => [
    ...config.connectors,
    config._internal.connectors.setup(mock({ accounts })),
  ])

  expect(config.connectors.length).toBe(count + 1)

  unwatch()
})
