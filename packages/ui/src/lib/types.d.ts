import type { Field, SmartContract, State } from 'o1js'

type Methods<T extends SmartContract> = {
  [K in keyof T]: K extends keyof SmartContract
    ? never
    : T[K] extends (...args: any[]) => any
      ? K
      : never
}[keyof T]

type StateVariable<T extends SmartContract> = {
  [K in keyof T]: T[K] extends State<any> ? K : never
}[keyof T]

interface ContractContextType<T extends SmartContract> {
  prepareTransaction: (args: {
    method: Methods<T>
    args: Field[]
  }) => Promise<string | { errorMessage: string }>
}
