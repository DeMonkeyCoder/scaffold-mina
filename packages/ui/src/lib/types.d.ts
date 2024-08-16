import { Field, SmartContract, State } from "o1js";

type Methods<T extends SmartContract> = {
  [K in keyof T]: K extends keyof SmartContract
    ? never
    : T[K] extends (...args: any[]) => any
    ? K
    : never;
}[keyof T];

type StateVariables<T extends SmartContract> = {
  [K in keyof T]: K extends keyof SmartContract
    ? never
    : T[K] extends State<any>
    ? K
    : never;
}[keyof T];

interface ContractContextType<T extends SmartContract> {
  loading: boolean;
  getState: (args: { stateVariable: StateVariables<T> }) => Promise<Field>;
  prepareTransaction: any; //TODO: fix this type
}
