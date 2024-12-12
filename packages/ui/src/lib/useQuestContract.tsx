import React, { createContext, ReactNode, useContext } from 'react'
import { fetchAccount, Field } from 'o1js'
import { useMinaProvider } from '@/lib/ZkappContext'
import { ContractContextType, Methods } from '@/lib/types'
import { Quest } from 'scaffold-mina-contracts'
import useDeployedContracts from '@/contracts/useDeployedContracts'
import { useAppKitNetwork } from '@reown/appkit/react'

const QuestContractContext = createContext<ContractContextType<Quest> | null>(
  null,
)

export const QuestContractProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const deployedContracts = useDeployedContracts()
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
    const zkappPublicKey = deployedContracts[chainId].Quest.publicKey
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
