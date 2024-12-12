import useDeployedContracts, {
  type ChainContracts,
} from '@/contracts/useDeployedContracts'
import type { Methods, StateVariable } from '@/lib/types'
import { useReadZkAppState } from '@/lib/useReadZkAppState'
import { useAppKitNetwork } from '@reown/appkit/react'
import type { SmartContract } from 'o1js'
import { useMemo, useState } from 'react'

function ContractMethod<T extends SmartContract>({
  contract,
  methodName,
}: {
  contract: new (...args: any[]) => T
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
          <div>
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

function ContractState<T extends SmartContract>({
  contract,
  stateVariable,
}: {
  contract: new (...args: any[]) => T
  stateVariable: StateVariable<T>
}) {
  const deployedContracts = useDeployedContracts()
  const { chainId: networkId } = useAppKitNetwork()
  const { data } = useReadZkAppState({
    smartContract: contract,
    publicKey: networkId
      ? // @ts-ignore
        deployedContracts[networkId][contract.name].publicKey
      : undefined,
    stateVariable,
    watch: true,
  })
  return (
    <div className="mb-5 p-5 bg-purple-50 shadow-lg rounded-3xl border-stone-400 break-words">
      <div className="font-bold">{String(stateVariable)}</div>
      <div>{data ? data.toString() : 'Loading...'}</div>
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
  const selectedContractMethods = useMemo(() => {
    if (selectedContract && chainContracts) {
      // @ts-ignore
      return chainContracts[selectedContract].contract['_methods'].map(
        (m: any) => m.methodName,
      ) as string[]
    }
  }, [chainContracts, selectedContract])
  const selectedContractStates = useMemo(() => {
    if (
      selectedContract &&
      chainContracts &&
      selectedContractMethods !== undefined
    ) {
      // @ts-ignore
      const notStateVariables = [
        'constructor',
        'init',
        ...selectedContractMethods,
      ]
      return Object.getOwnPropertyNames(
        chainContracts[selectedContract].contract.prototype,
      ).filter((n) => !notStateVariables.includes(n))
    }
    return []
  }, [chainContracts, selectedContract, selectedContractMethods])
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
        <>
          <div className="px-9 py-2">
            {selectedContractStates.map((stateVariable) => (
              <ContractState
                key={stateVariable}
                contract={chainContracts[selectedContract].contract}
                // @ts-ignore
                stateVariable={stateVariable}
              />
            ))}
            <div className="py-2 px-5 mb-2 bg-purple-50 rounded-3xl border-stone-400 w-100">
              Write
            </div>
            {selectedContractMethods?.map((methodName) => (
              <ContractMethod
                key={methodName}
                contract={chainContracts[selectedContract].contract}
                // @ts-ignore
                methodName={methodName}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
