import { attest } from '@ark/attest'
import { test } from 'vitest'

import { createClient } from './createClient'
import { createPublicClient } from './createPublicClient'
import { publicActions } from './decorators/public'
import { http } from './transports/http'

test('createPublicClient', () => {
  createPublicClient({
    transport: http('https://cloudflare-eth.com'),
  })
  attest.instantiations([13956, 'instantiations'])
})

test('createClient.extend + publicActions', () => {
  createClient({
    transport: http('https://cloudflare-eth.com'),
  }).extend(publicActions)
  attest.instantiations([328328, 'instantiations'])
})
