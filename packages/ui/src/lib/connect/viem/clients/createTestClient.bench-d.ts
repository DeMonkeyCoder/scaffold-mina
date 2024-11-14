import { attest } from '@ark/attest'
import { test } from 'vitest'

import { createClient } from './createClient'
import { createTestClient } from './createTestClient'
import { testActions } from './decorators/test'
import { http } from './transports/http'

test('createTestClient', () => {
  createTestClient({
    mode: 'anvil',
    transport: http('https://cloudflare-eth.com'),
  })
  attest.instantiations([2100, 'instantiations'])
})

test('createClient.extend + testActions', () => {
  createClient({
    transport: http('https://cloudflare-eth.com'),
  }).extend(testActions({ mode: 'anvil' }))
  attest.instantiations([7900, 'instantiations'])
})
