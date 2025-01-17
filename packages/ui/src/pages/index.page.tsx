import AccountDoesNotExist from '@/components/AccountDoesNotExist'
import { ConnectWallet } from '@/components/ConnectWallet'
import LoadingScreen from '@/components/LoadingScreen'
import deployedContracts from '@/contracts/deployedContracts'
import { useMinaProvider } from '@/lib/ZkappContext'
import { useAccount } from '@/lib/connect/react/hooks/useAccount'
import { useFetchAccount } from '@/lib/connect/react/hooks/useFetchAccount'
import { QuestContractProvider, useQuestContract } from '@/lib/useQuestContract'
import { isSupportedNetwork } from '@/utils'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Quest } from 'scaffold-mina-contracts'
import GradientBG from '../components/GradientBG.js'
import { CircuitString } from 'o1js'

enum TransactionState {
  INITIAL = 0,
  PREPARING = 1,
  AWAITING_USER_APPROVAL = 2,
}

function HomeBody() {
  const { prepareTransaction } = useQuestContract()
  const { zkappWorkerClient } = useMinaProvider()
  const { address, isConnected } = useAppKitAccount()

  const { accountExists } = useMinaProvider()
  const { chainId: networkId } = useAppKitNetwork()

  const { data: fetchedAccount, isFetching } = useFetchAccount({
    address: networkId
      ? deployedContracts.Quest.addressMap[networkId]
      : undefined,
    watch: true,
  })

  const currentNum = useMemo(() => {
    if (fetchedAccount && !isFetching) {
      return new Quest(fetchedAccount.publicKey).counter.get()
    }
  }, [fetchedAccount, isFetching])

  const [questSolution, setQuestSolution] = useState('')

  const [txState, setTxState] = useState(TransactionState.INITIAL)
  const [transactionLink, setTransactionLink] = useState('')

  const { connector } = useAccount()
  useEffect(() => {
    connector?.getProvider().then((provider) => console.log({ provider }))
  }, [connector])

  const onSendTransaction = useCallback(async () => {
    if (txState !== TransactionState.INITIAL || !connector) return
    try {
      setTxState(TransactionState.PREPARING)
      const transactionJSON = await prepareTransaction({
        method: 'solve',
        args: [CircuitString.fromString(questSolution.toLowerCase()).hash()],
      })
      setTxState(TransactionState.AWAITING_USER_APPROVAL)
      const provider = await connector.getProvider()
      // @ts-ignore
      const { hash } = await provider.request({
        method: 'mina_sendTransaction',
        params: {
          transaction: transactionJSON,
          feePayer: {
            fee: 0.1,
            memo: '',
          },
        },
      })
      setTransactionLink(`https://minascan.io/devnet/tx/${hash}`)
    } catch (e) {
      alert(JSON.stringify(e))
    }
    setTxState(TransactionState.INITIAL)
  }, [connector, prepareTransaction, questSolution, txState])

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setTransactionLink('')
  }, [address])

  return (
    <GradientBG>
      <div className="main">
        {!zkappWorkerClient ? (
          <LoadingScreen />
        ) : (
          <div className="center">
            {transactionLink && (
              <div className="mb-1">
                <button className="card flex items-center justify-center">
                  <Image width={16} height={16} src="/assets/view.svg" alt="" />
                  <a href={transactionLink} target="_blank" rel="noreferrer">
                    View Transaction
                  </a>
                </button>
              </div>
            )}
            {isConnected ? (
              isSupportedNetwork(networkId) ? (
                accountExists ? (
                  <>
                    <div className="riddle-box bg-gradient-to-tr from-black/60 to-blue-800/60 border m-8">
                      <div className="justify-center items-center">
                        <div className="text-center text-2xl flex items-center justify-center text-white">
                          Solve the riddle{' '}
                          <img
                            className="px-2 w-11"
                            src="/assets/thinkingface.svg"
                            alt=""
                          />
                        </div>
                        <div className="text-justify text-last-justify text-white">
                          <br />I am a mighty ledger, yet I weigh next to none,
                          <br />
                          Verified by all, even when the work is done.
                          <br />
                          My size is constant, no matter how much I grow,
                          <br />
                          What’s my name, this protocol you need to know?
                          <br />
                          <br />
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="p-2 my-4 rounded-l border-2 border-gray-400 w-56 h-11"
                          placeholder="Solution"
                          value={questSolution}
                          onChange={(e) => setQuestSolution(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        className="card flex items-center justify-center whitespace-nowrap"
                        onClick={onSendTransaction}
                        disabled={txState !== TransactionState.INITIAL}
                      >
                        {txState !== TransactionState.PREPARING && (
                          <Image
                            width={20}
                            height={20}
                            src="/assets/arrow5.svg"
                            alt=""
                          />
                        )}
                        {txState === TransactionState.AWAITING_USER_APPROVAL
                          ? 'Awaiting Approval...'
                          : txState === TransactionState.PREPARING
                            ? 'Preparing Transaction...'
                            : 'Send Transaction'}
                      </button>
                    </div>
                    <div className="text-s text-white font-firacode">
                      Correct Submissions: {currentNum?.toString()}{' '}
                    </div>
                  </>
                ) : (
                  <AccountDoesNotExist />
                )
              ) : (
                <div>
                  Please switch to a supported network.
                  <div>
                    <ConnectWallet />
                  </div>
                </div>
              )
            ) : (
              <div>
                <div className="text-white text-xl">Welcome to</div>
                <div className="flex items-center justify-center text-3xl font-semibold mr-6 text-white py-3">
                  <img
                    className="px-2 w-12"
                    src="/assets/minalogo.png"
                    alt=""
                  />
                  Scaffold-
                  <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
                    MINA
                  </div>
                </div>
                <div className="flex items-center justify-center center mt-1">
                  <ConnectWallet />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GradientBG>
  )
}

export default function Home() {
  return (
    <QuestContractProvider>
      <HomeBody />
    </QuestContractProvider>
  )
}
