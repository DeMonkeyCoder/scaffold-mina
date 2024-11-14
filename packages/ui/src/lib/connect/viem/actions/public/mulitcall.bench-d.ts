import { attest } from '@ark/attest'
import { test } from 'vitest'

import {
  baycContractConfig,
  usdcContractConfig,
} from '../../../test/src/abis'
import { mainnet } from '../../chains/index'
import { createClient } from '../../clients/createClient'
import { http } from '../../clients/transports/http'
import { multicall } from './multicall'

const client = createClient({ chain: mainnet, transport: http() })

test('return type', () => {
  const res = multicall(client, {
    allowFailure: false,
    contracts: [
      {
        ...usdcContractConfig,
        functionName: 'totalSupply',
      },
      {
        ...usdcContractConfig,
        functionName: 'balanceOf',
        args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
      },
      {
        ...baycContractConfig,
        functionName: 'name',
      },
    ],
  })
  attest.instantiations([80523, 'instantiations'])
  attest<Promise<[bigint, bigint, string]>>(res)
})
