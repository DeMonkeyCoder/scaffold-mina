import { fetchAccount, Field, PublicKey } from "o1js";

import {
  ContractName,
  State,
  WorkerFunctions,
  ZkappWorkerReponse,
  ZkappWorkerRequest,
} from "./zkappWorker";

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  worker: Worker;
  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };
  nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./zkappWorker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  setActiveInstanceToDevnet() {
    return this._call("setActiveInstanceToDevnet", {});
  }

  loadAndCompileContract(args: { contractName: ContractName }) {
    return this._call("loadAndCompileContract", args);
  }

  loadContract(args: { contractName: ContractName }) {
    return this._call("loadContract", args);
  }

  compileContract(args: { contractName: ContractName }) {
    return this._call("compileContract", args);
  }

  // ---------------------------------------------------------------------------------------

  fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey;
  }): ReturnType<typeof fetchAccount> {
    const result = this._call("fetchAccount", {
      publicKey58: publicKey.toBase58(),
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  initZkappInstance({
    contractName,
    publicKey,
  }: {
    contractName: ContractName;
    publicKey: PublicKey;
  }) {
    return this._call("initZkappInstance", {
      contractName,
      publicKey58: publicKey.toBase58(),
    });
  }

  async getNum(): Promise<Field> {
    const result = await this._call("getState", {
      contractName: "Add",
      stateVariable: "num",
    });
    return Field.fromJSON(JSON.parse(result as string));
  }

  async getState<T extends ContractName>(args: {
    contractName: T;
    stateVariable: keyof State["contracts"][T]["zkapp"];
  }) {
    const result = await this._call("getState", args);
    return Field.fromJSON(JSON.parse(result as string));
  }

  async prepareTransaction<T extends ContractName>(args: {
    contractName: T;
    method: keyof State["contracts"][T]["zkapp"];
  }) {
    return await this._call("prepareTransaction", args);
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
