import { expect, test, vi } from 'vitest'

import type { ConnectorEventMap } from './connectors/createConnector'
import { createEmitter } from './createEmitter'
import { uid } from './utils/uid'

test('default', () => {
  const emitter = createEmitter<ConnectorEventMap>(uid())

  const onMessage = vi.fn()
  emitter.on('message', onMessage)
  emitter.emit('message', { type: 'bar', data: 'baz' })

  expect(onMessage).toHaveBeenCalledWith({
    type: 'bar',
    data: 'baz',
    uid: emitter.uid,
  })
})
