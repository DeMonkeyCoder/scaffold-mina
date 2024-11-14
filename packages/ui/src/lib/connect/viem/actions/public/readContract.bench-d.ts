import { attest } from '@ark/attest'
import { test } from 'vitest'

import { usdcContractConfig } from '../../../test/src/abis'
import { mainnet } from '../../chains/index'
import { createClient } from '../../clients/createClient'
import { http } from '../../clients/transports/http'
import { readContract } from './readContract'

const client = createClient({ chain: mainnet, transport: http() })

test('return type', () => {
  const res = readContract(client, {
    ...usdcContractConfig,
    functionName: 'balanceOf',
    args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
  })
  attest.instantiations([53192, 'instantiations'])
  attest<Promise<bigint>>(res)
})
