import { useAppKitNetwork } from '@reown/appkit/react'
import { Mina, PublicKey, fetchAccount } from 'o1js'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAccount } from 'wagmina'
import ZkappWorkerClient from './zkappWorkerClient'

type MinaAccountData = {
  accountExists: boolean | null
}

type ZkappContextType = {
  zkappWorkerClient: ZkappWorkerClient | null
} & MinaAccountData

const ZkappContext = createContext<ZkappContextType | null>(null)

export const ZkappProvider = ({ children }: { children: ReactNode }) => {
  const [zkappWorkerClient, setZkappWorkerClient] =
    useState<ZkappWorkerClient | null>(null)
  const { address } = useAccount()

  useEffect(() => {
    ;(async () => {
      if (!zkappWorkerClient) {
        const zkappWorkerClientInstance = new ZkappWorkerClient()
        await zkappWorkerClientInstance.workerReady
        setZkappWorkerClient(zkappWorkerClientInstance)
      }
    })()
  }, [zkappWorkerClient])

  const [accountExists, setAccountExists] = useState<boolean | null>(null)

  useEffect(() => {
    ;(async () => {
      if (address) {
        const res = await fetchAccount({
          publicKey: PublicKey.fromBase58(address),
        })
        setAccountExists(res.error == null)
      }
    })()
  }, [address])

  const { caipNetwork } = useAppKitNetwork()
  useEffect(() => {
    if (
      caipNetwork &&
      'graphqlEndpoint' in caipNetwork &&
      typeof caipNetwork.graphqlEndpoint === 'string'
    ) {
      Mina.setActiveInstance(Mina.Network(caipNetwork.graphqlEndpoint))
      zkappWorkerClient?.setActiveInstance({
        graphqlEndpoint: caipNetwork.graphqlEndpoint,
      })
    }
  }, [caipNetwork, zkappWorkerClient])

  return (
    <ZkappContext.Provider
      value={{
        zkappWorkerClient,
        accountExists,
      }}
    >
      {children}
    </ZkappContext.Provider>
  )
}

export const useMinaProvider = (): ZkappContextType => {
  const context = useContext(ZkappContext)
  if (!context) {
    throw new Error('useMinaProvider must be used within a ZkappProvider')
  }
  return context
}
