import { test } from 'vitest'
import { createClient } from '../../../clients/createClient'
import { custom } from '../../../clients/transports/custom'
import { showCallsStatus } from './showCallsStatus'

const client = createClient({
  transport: custom({
    async request() {
      return null
    },
  }),
})

test('default', async () => {
  await showCallsStatus(client, {
    id: '0xdeadbeef',
  })
})
