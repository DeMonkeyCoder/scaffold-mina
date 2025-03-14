import deployedContracts from '@/contracts/deployedContracts'
import type { Methods, StateVariable } from '@/lib/types'
import { useAppKitNetwork } from '@reown/appkit/react'
import type { SmartContract, State } from 'o1js'
import { useMemo, useState } from 'react'
import { useFetchAccount } from 'wagmina'

const contractNames = Object.keys(deployedContracts) as Array<
  keyof typeof deployedContracts
>

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
    <div className="mb-5 p-4 bg-black shadow-lg rounded-3xl border-white border-2 text-white break-words ">
      <div className="font-bold">{String(methodName)}</div>
      <div>
        {paramNames.map((paramName) => (
          <div key={paramName}>
            <label>{paramName}</label>
            <br />
            <input
              type="text"
              placeholder="write here"
              className="mt-2 py-1 px-3 bg-black border-white rounded-full border-2 w-full"
            />
          </div>
        ))}
      </div>
      <button className="flex items-center justify-center text-black font-firacode whitespace-nowrap bg-white border rounded-md px-4 py-1 mt-4 text-xs hover:bg-black hover:text-white duration-200">
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
  const { data: fetchedAccount, isFetching } = useFetchAccount({
    address,
    watch: true,
  })

  const contractMethods = useMemo(() => {
    // @ts-ignore
    return contract._methods.map((m: any) => m.methodName) as string[]
  }, [contract])

  const contractStates = useMemo(() => {
    const notStateVariables = ['constructor', 'init', ...contractMethods]
    const contractInstance =
      fetchedAccount && !isFetching
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
  }, [contractMethods, fetchedAccount, isFetching, contract])

  return (
    <div className="px-9 py-2">
      <div className="pl-9 mb-2 text-white text-2xl font-firacode">Read</div>
      {contractStates.map((stateVariable) => (
        <div
          key={stateVariable.name.toString()}
          className="mb-5 p-4 bg-black text-white shadow-lg rounded-3xl border-white border-2 break-words"
        >
          <div className="font-bold">{String(stateVariable.name)}</div>
          <div>{stateVariable.value?.toString() ?? 'Loading...'}</div>
        </div>
      ))}
      <div className="pl-9 mb-2 text-white text-2xl font-firacode">Write</div>
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
  const chainContractNames = useMemo(
    () =>
      networkId
        ? contractNames.filter(
            (contractName) =>
              deployedContracts[contractName].addressMap[networkId],
          )
        : [],
    [networkId],
  )
  const [selectedContract, setSelectedContract] = useState<
    keyof typeof deployedContracts | undefined
  >(chainContractNames?.[0])

  return (
    <div className="overflow-auto h-screen max-w-[1000px] w-[90%] mx-auto pt-5 pb-10">
      <div className="px-5">
        {chainContractNames.map((contractName) => (
          <button
            key={contractName}
            onClick={() => setSelectedContract(contractName)}
            className={`card items-center justify-center whitespace-nowrap text-sm ${selectedContract === contractName ? '!bg-slate-900 !text-white' : ''}`}
          >
            {contractName}
          </button>
        ))}
      </div>
      {networkId && selectedContract && (
        <ContractView
          contract={deployedContracts[selectedContract].contract}
          address={deployedContracts[selectedContract].addressMap[networkId]}
        />
      )}
    </div>
  )
}
