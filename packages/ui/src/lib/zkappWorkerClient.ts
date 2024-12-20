import {
  Field,
  type PublicKey,
  type SmartContract,
  type fetchAccount,
} from 'o1js'

import type { Methods, StateVariable } from '@/lib/types'
import type {
  ContractName,
  WorkerFunctions,
  ZkappWorkerReponse,
  ZkappWorkerRequest,
} from './zkappWorker'

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  worker: Worker
  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void }
  }
  nextId: number

  workerReady: Promise<void>
  private workerReadyResolve: () => void

  constructor() {
    this.worker = new Worker(new URL('./zkappWorker.ts', import.meta.url))
    this.promises = {}
    this.nextId = 0

    this.workerReady = new Promise<void>((resolve) => {
      this.workerReadyResolve = resolve
    })

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      if ('type' in event.data && event.data.type === 'ready') {
        this.workerReadyResolve()
        return
      }
      if (event.data.data?.errorMessage) {
        this.promises[event.data.id].reject(event.data.data.errorMessage)
      } else {
        this.promises[event.data.id].resolve(event.data.data)
      }
      delete this.promises[event.data.id]
    }
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject }

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      }

      this.worker.postMessage(message)

      this.nextId++
    })
  }

  setActiveInstance(args: { graphqlEndpoint: string }) {
    return this._call('setActiveInstance', args)
  }

  loadAndCompileContract(args: { contractName: ContractName }) {
    return this._call('loadAndCompileContract', args)
  }

  loadContract(args: { contractName: ContractName }) {
    return this._call('loadContract', args)
  }

  compileContract(args: { contractName: ContractName }) {
    return this._call('compileContract', args)
  }

  // ---------------------------------------------------------------------------------------

  fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey
  }): ReturnType<typeof fetchAccount> {
    const result = this._call('fetchAccount', {
      publicKey58: publicKey.toBase58(),
    })
    return result as ReturnType<typeof fetchAccount>
  }

  initZkappInstance({
    contractName,
    publicKey,
  }: {
    contractName: ContractName
    publicKey: PublicKey
  }) {
    return this._call('initZkappInstance', {
      contractName,
      publicKey58: publicKey.toBase58(),
    })
  }

  async getState<T extends SmartContract>(args: {
    //TODO: fix this general string type
    contractName: string
    stateVariable: StateVariable<T>
  }) {
    const result = await this._call('getState', args)
    return Field.fromJSON(JSON.parse(result as string))
  }

  async prepareTransaction<T extends SmartContract>(args: {
    //TODO: fix this general string type
    contractName: string
    method: Methods<T>
    args?: Field[]
  }): Promise<any> {
    return await this._call('prepareTransaction', {
      ...args,
      args: args.args?.map((arg) => arg.toJSON()),
    })
  }
}
