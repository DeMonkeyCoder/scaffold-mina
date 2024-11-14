import { expect, test } from 'vitest'

import { setRpcUrl } from './setRpcUrl'

import { anvilMainnet } from '../../../test/src/anvil'

const client = anvilMainnet.getClient()

test('sets the rpc url', async () => {
  await expect(setRpcUrl(client, anvilMainnet.forkUrl)).resolves.toBeUndefined()
})
