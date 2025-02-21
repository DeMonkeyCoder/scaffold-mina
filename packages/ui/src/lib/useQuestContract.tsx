import deployedContracts from '@/contracts/deployedContracts'
import { useMinaProvider } from '@/lib/ZkappContext'
import type { ContractContextType, Methods } from '@/lib/types'
import { useAppKitNetwork } from '@reown/appkit/react'
import { type Field, PublicKey, fetchAccount } from 'o1js'
import { createContext, type ReactNode, useContext } from 'react'
import type { Quest } from 'scaffold-mina-contracts'

const QuestContractContext = createContext<ContractContextType<Quest> | null>(
  null,
)

export const QuestContractProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { chainId } = useAppKitNetwork()
  const { zkappWorkerClient } = useMinaProvider()

  // TODO: optimize this function by pre-loading the contract or using cloud workers
  const prepareTransaction = async ({
    method,
    args,
  }: {
    method: Methods<Quest>
    args?: Field[]
  }) => {
    if (!zkappWorkerClient) {
      throw Error('zkappWorkerClient not initialized')
    }
    if (!chainId) {
      throw Error('chainId not defined')
    }
    const address = deployedContracts.Quest.addressMap[chainId]
    if (!address) {
      throw Error('zkapp address for chain not provided')
    }
    const zkappPublicKey = PublicKey.fromBase58(address)
    await zkappWorkerClient.loadAndCompileContract({
      contractName: 'Quest',
    })
    await zkappWorkerClient.initZkappInstance({
      contractName: 'Quest',
      publicKey: zkappPublicKey,
    })
    await fetchAccount({
      publicKey: zkappPublicKey,
    })
    return zkappWorkerClient.prepareTransaction({
      contractName: 'Quest',
      method,
      args,
    })
  }

  return (
    <QuestContractContext.Provider
      value={{
        prepareTransaction,
      }}
    >
      {children}
    </QuestContractContext.Provider>
  )
}

export const useQuestContract = (): ContractContextType<Quest> => {
  const context = useContext(QuestContractContext)
  if (!context) {
    throw new Error(
      'useQuestContractContext must be used within a QuestContractProvider',
    )
  }
  return context
}
