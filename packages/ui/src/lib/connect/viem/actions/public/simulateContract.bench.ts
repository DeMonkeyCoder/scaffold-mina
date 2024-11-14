import { Contract, Typed } from 'ethers'

import { bench, describe } from 'vitest'

import { wagmiContractConfig } from '~test/src/abis'
import { ethersProvider } from '~test/src/bench'
import { accounts } from '~test/src/constants'

import { anvilMainnet } from '../../../test/src/anvil'

import { simulateContract } from './simulateContract'

const client = anvilMainnet.getClient()

describe('Simulate Contract', () => {
  bench('viem: `simulateContract`', async () => {
    await simulateContract(client, {
      ...wagmiContractConfig,
      functionName: 'mint',
      args: [42111n],
      account: accounts[0].address,
    })
  })

  bench('ethers: `callStatic`', async () => {
    const wagmi = new Contract(
      wagmiContractConfig.address,
      wagmiContractConfig.abi,
      ethersProvider,
    )
    await wagmi.mint.staticCall(Typed.uint(42111), {
      from: accounts[0].address,
    })
  })
})
