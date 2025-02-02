import {fetchAccount, Field, Mina, PublicKey} from 'o1js'
// ---------------------------------------------------------------------------------------
import type {Add} from '../../../contracts/src/Add'
import type {Quest} from '../../../contracts/src/Quest'

const state = {
  contracts: {
    Add: {
      contract: null as null | typeof Add,
      zkapp: null as null | Add,
    },
    Quest: {
      contract: null as null | typeof Quest,
      zkapp: null as null | Quest,
    },
  },
}

export type State = typeof state

// ---------------------------------------------------------------------------------------

export type ContractName = keyof State['contracts']

const functions = {
  setActiveInstance: async ({
    graphqlEndpoint,
  }: { graphqlEndpoint: string }) => {
    const Network = Mina.Network(graphqlEndpoint)
    Mina.setActiveInstance(Network)
  },
  loadContract: async ({ contractName }: { contractName: ContractName }) => {
    if (!state.contracts[contractName])
      throw new Error(`${contractName} contract is not defined`)
    if (!state.contracts[contractName].contract) {
      const contract = (
        await import(`scaffold-mina-contracts/build/src/${contractName}.js`)
      )[contractName]
      if (!contract) {
        throw new Error(
          `Could not load contract ${contractName} from the module`,
        )
      }
      state.contracts[contractName].contract = contract
    }
  },
  compileContract: async ({ contractName }: { contractName: ContractName }) => {
    const contract = state.contracts[contractName]?.contract
    if (!contract) throw new Error(`${contractName} contract is not loaded`)
    await contract.compile()
  },
  loadAndCompileContract: async (args: { contractName: ContractName }) => {
    await functions.loadContract(args)
    await functions.compileContract(args)
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    return await fetchAccount({
      publicKey: PublicKey.fromBase58(args.publicKey58),
    })
  },
  initZkappInstance: async ({
    publicKey58,
    contractName,
  }: {
    contractName: ContractName
    publicKey58: string
  }) => {
    const contract = state.contracts[contractName]?.contract
    if (!contract) throw new Error(`${contractName} contract is not loaded`)
    state.contracts[contractName].zkapp = new contract(
      PublicKey.fromBase58(publicKey58),
    )
  },
  getState: async <T extends ContractName>({
    contractName,
    stateVariable,
  }: {
    contractName: T
    stateVariable: keyof State['contracts'][T]['zkapp']
  }) => {
    const zkapp = state.contracts[contractName]?.zkapp
    if (!zkapp) throw new Error(`${contractName} zkapp is not initialized.`)
    // @ts-ignore
    const currentNum = await zkapp[stateVariable].get()
    return JSON.stringify(currentNum.toJSON())
  },
  prepareTransaction: async <T extends ContractName>({
    contractName,
    method,
    args,
  }: {
    contractName: T
    method: keyof State['contracts'][T]['zkapp']
    args?: any[]
  }): Promise<string | { errorMessage: string }> => {
    const zkapp = state.contracts[contractName]?.zkapp
    if (!zkapp) throw new Error(`${contractName} zkapp is not initialized.`)
    try {
      const transaction = await Mina.transaction(async () => {
        // @ts-ignore
        // biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
        await zkapp[method](...args?.map((arg) => Field.fromJSON(arg)))
      })
      await transaction.prove()
      return transaction.toJSON()
    } catch (e) {
      return {
        errorMessage: String(e),
      }
    }
  },
}

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions

export type ZkappWorkerRequest = {
  id: number
  fn: WorkerFunctions
  args: any
}

export type ZkappWorkerReponse = {
  id: number
  data: any
}

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      if (event.data.fn in functions) {
        const returnData = await functions[event.data.fn](event.data.args)

        const message: ZkappWorkerReponse = {
          id: event.data.id,
          data: returnData,
        }
        postMessage(message)
      }
    },
  )
}

postMessage({ type: 'ready' })
