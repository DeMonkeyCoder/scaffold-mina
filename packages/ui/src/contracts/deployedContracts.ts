import { minaDevnet } from '@/lib/connect/appkit/networks'
import type { CaipNetwork } from '@reown/appkit-common'
import type { SmartContract } from 'o1js'
import { Add, Quest } from 'scaffold-mina-contracts'

export type Contracts = {
  [key: string]: {
    contract: new (..._args: any[]) => SmartContract
    addressMap: {
      [chainId: CaipNetwork['id']]: string
    }
  }
}

const deployedContracts: Contracts = {
  Quest: {
    contract: Quest,
    addressMap: {
      [minaDevnet.id]:
        'B62qjDnppFhY5tsEmLbCDRniCoJcYqLmHpEeXVfwM4Ej18uJFhTrmBb',
    },
  },
  Add: {
    contract: Add,
    addressMap: {
      [minaDevnet.id]:
        'B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP',
    },
  },
} as const

export default deployedContracts
