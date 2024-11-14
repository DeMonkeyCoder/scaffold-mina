import { beforeEach, expect, test } from 'vitest'
import { bundlerMainnet } from '../../../../test/src/bundler'
import { createClient } from '../../../clients/createClient'
import { http } from '../../../clients/transports/http'
import { paymasterActions } from './paymaster'

const client = createClient({
  transport: http('https://'),
})

beforeEach(async () => {
  await bundlerMainnet.restart()
})

test('default', async () => {
  expect(paymasterActions(client)).toMatchInlineSnapshot(`
    {
      "getPaymasterData": [Function],
      "getPaymasterStubData": [Function],
    }
  `)
})
