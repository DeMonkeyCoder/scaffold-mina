import useDeployedContracts, {
  type ChainContracts,
} from '@/contracts/useDeployedContracts'
import { useFetchAccount } from '@/lib/connect/react/hooks/useFetchAccount'
import type { Methods, StateVariable } from '@/lib/types'
import { useAppKitNetwork } from '@reown/appkit/react'
import type { SmartContract, State } from 'o1js'
import { useMemo, useState } from 'react'

function ContractMethod<T extends SmartContract>({
  contract,
  methodName,
}: {
  contract: new (..._args: any[]) => T
  methodName: Methods<T>
}) {
  const paramNames = useMemo(() => {
    const methodRegex = new RegExp(
      `async?\\s+${String(methodName)}\\s*\\(\\s*([a-zA-Z0-9_,\\s]*)\\s*\\)`,
      'g',
    )
    const match = methodRegex.exec(contract.toString())
    if (!match) {
      throw new Error(`Method '${String(methodName)}' not found in class.`)
    }
    const paramString = match[1].trim()
    if (paramString === '') {
      return []
    }
    return paramString
      .split(',')
      .map((param) => param.trim())
      .filter((param) => param !== '')
  }, [contract, methodName])
  return (
    <div className="mb-5 p-5 bg-purple-50 shadow-lg rounded-3xl border-stone-400 break-words">
      <div className="font-bold">{String(methodName)}</div>
      <div>
        {paramNames.map((paramName) => (
          <div key={paramName}>
            <label>{paramName}</label>
            <br />
            <input
              type="text"
              className="mt-2 py-1 px-3 border-gray-300 rounded-full border-2 w-full"
            />
          </div>
        ))}
      </div>
      <button className="card flex items-center justify-center whitespace-nowrap">
        Send Transaction
      </button>
    </div>
  )
}

function ContractView<T extends SmartContract>({
  contract,
  address,
}: {
  contract: new (..._args: any[]) => T
  address: string
}) {
  const { data: fetchedAccount } = useFetchAccount({
    address,
    watch: true,
  })

  const contractMethods = useMemo(() => {
    // @ts-ignore
    return contract._methods.map((m: any) => m.methodName) as string[]
  }, [contract])

  const contractStates = useMemo(() => {
    const notStateVariables = ['constructor', 'init', ...contractMethods]
    const contractInstance = fetchedAccount
      ? new contract(fetchedAccount.publicKey)
      : undefined
    return (
      Object.getOwnPropertyNames(contract.prototype).filter(
        (n) => !notStateVariables.includes(n),
      ) as StateVariable<T>[]
    ).map((stateVariable) => ({
      name: stateVariable,
      value: contractInstance
        ? (contractInstance[stateVariable] as State<any>).get()
        : undefined,
    }))
  }, [contract, fetchedAccount, contractMethods])

  return (
    <div className="px-9 py-2">
      {contractStates.map((stateVariable) => (
        <div
          key={stateVariable.name.toString()}
          className="mb-5 p-5 bg-purple-50 shadow-lg rounded-3xl border-stone-400 break-words"
        >
          <div className="font-bold">{String(stateVariable.name)}</div>
          <div>{stateVariable.value?.toString() ?? 'Loading...'}</div>
        </div>
      ))}
      <div className="py-2 px-5 mb-2 bg-purple-50 rounded-3xl border-stone-400 w-100">
        Write
      </div>
      {contractMethods?.map((methodName) => (
        // @ts-ignore
        <ContractMethod
          key={methodName}
          contract={contract}
          // @ts-ignore
          methodName={methodName}
        />
      ))}
    </div>
  )
}

export default function DebugContracts() {
  const { chainId: networkId } = useAppKitNetwork()
  const deployedContracts = useDeployedContracts()
  const chainContracts: ChainContracts = useMemo(
    () => (networkId ? deployedContracts[networkId] : {}),
    [deployedContracts, networkId],
  )
  const [selectedContract, setSelectedContract] = useState<
    keyof typeof chainContracts | undefined
  >(chainContracts ? Object.keys(chainContracts)[0] : undefined)

  return (
    <div className="pt-20 overflow-auto h-screen">
      <div className="px-5">
        {chainContracts &&
          Object.keys(chainContracts).map((contractName) => (
            <button
              key={contractName}
              onClick={() => setSelectedContract(contractName)}
              className={`card items-center justify-center whitespace-nowrap text-sm ${selectedContract === contractName ? '!bg-blue-700 !text-white' : ''}`}
            >
              {contractName}
            </button>
          ))}
      </div>
      {chainContracts && selectedContract && (
        <ContractView
          contract={chainContracts[selectedContract].contract}
          address={chainContracts[selectedContract].publicKey.toBase58()}
        />
      )}
    </div>
  )
}
