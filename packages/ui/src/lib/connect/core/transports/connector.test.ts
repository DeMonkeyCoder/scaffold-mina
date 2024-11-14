import { expect, test } from 'vitest'
import { injected } from '../connectors/injected'
import { unstable_connector } from './connector'

test('setup', () => {
  expect(unstable_connector(injected)({})).toMatchInlineSnapshot(`
    {
      "config": {
        "key": "connector",
        "name": "Connector",
        "request": [Function],
        "retryCount": 3,
        "retryDelay": 150,
        "timeout": undefined,
        "type": "connector",
      },
      "request": [Function],
      "value": undefined,
    }
  `)
})
