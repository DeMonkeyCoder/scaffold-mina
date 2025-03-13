import AccountDoesNotExist from '@/components/AccountDoesNotExist'
import { ConnectWallet } from '@/components/ConnectWallet'
import LoadingScreen from '@/components/LoadingScreen'
import SwitchChainDemo from '@/components/SwitchChainDemo'
import deployedContracts from '@/contracts/deployedContracts'
import { useMinaProvider } from '@/lib/ZkappContext'
import { QuestContractProvider, useQuestContract } from '@/lib/useQuestContract'
import { isSupportedNetwork } from '@/utils'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import Image from 'next/image'
import { CircuitString } from 'o1js'
import type { ZkappCommand } from 'o1js/dist/web/bindings/mina-transaction/gen/transaction-json'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Quest } from 'scaffold-mina-contracts'
import { useSignZkappTransaction } from 'wagmina'
import { useFetchAccount } from 'wagmina'
import { useSendSignedTransaction } from 'wagmina'
import { useSendTransaction } from 'wagmina'
import GradientBG from '../components/GradientBG.js'

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

  const [preparingTransaction, setPreparingTransaction] = useState(false)
  const [transactionLink, setTransactionLink] = useState('')

  const prepareQuestTransaction = useCallback(async () => {
    const zkappCommandStr = await prepareTransaction({
      method: 'solve',
      args: [CircuitString.fromString(questSolution.toLowerCase()).hash()],
    })
    if (typeof zkappCommandStr === 'object') {
      throw new Error(zkappCommandStr.errorMessage)
    }
    return zkappCommandStr
  }, [prepareTransaction, questSolution])

  const {
    sendTransaction,
    isPending: isPendingSendTransaction,
    data: txHash,
  } = useSendTransaction()

  useEffect(() => {
    setTransactionLink(`https://minascan.io/devnet/tx/${txHash}`)
  }, [txHash])

  const onSendTransaction = useCallback(async () => {
    if (preparingTransaction || isPendingSendTransaction) return
    try {
      setPreparingTransaction(true)
      const zkappCommandStr = await prepareQuestTransaction()
      sendTransaction({
        type: 'zkapp',
        zkappCommand: JSON.parse(zkappCommandStr) as ZkappCommand,
        feePayer: {
          fee: 5000000000n,
          memo: '',
        },
      })
    } catch (e) {
      alert(String(e))
    }
    setPreparingTransaction(false)
  }, [
    isPendingSendTransaction,
    prepareQuestTransaction,
    preparingTransaction,
    sendTransaction,
  ])

  const {
    signTransaction,
    isPending: isPendingSignTransaction,
    data: signedTransaction,
  } = useSignZkappTransaction()

  const onSignTransaction = useCallback(async () => {
    if (preparingTransaction || isPendingSignTransaction) return
    try {
      setPreparingTransaction(true)
      const zkappCommandStr = await prepareQuestTransaction()
      signTransaction({
        zkappCommand: JSON.parse(zkappCommandStr) as ZkappCommand,
        feePayer: {
          fee: 500000000n,
          memo: '',
        },
      })
    } catch (e) {
      alert(String(e))
    }
    setPreparingTransaction(false)
  }, [
    isPendingSignTransaction,
    prepareQuestTransaction,
    preparingTransaction,
    signTransaction,
  ])

  const {
    sendSignedTransaction,
    isPending: isPendingSendSignedTransaction,
    data: signedTxHash,
  } = useSendSignedTransaction()

  useEffect(() => {
    setTransactionLink(`https://minascan.io/devnet/tx/${signedTxHash}`)
  }, [signedTxHash])

  const onSendSignedTransaction = useCallback(async () => {
    if (!signedTransaction || isPendingSendSignedTransaction) return
    sendSignedTransaction({
      type: 'zkapp',
      input: {
        zkappCommand: signedTransaction,
      },
    })
  }, [isPendingSendSignedTransaction, sendSignedTransaction, signedTransaction])

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
                  signedTransaction ? (
                    <>
                      <div className="riddle-box bg-gradient-to-tr from-black/60 to-blue-800/60 border m-8">
                        <div className="justify-center items-center">
                          <textarea
                            cols={60}
                            rows={10}
                            value={JSON.stringify(signedTransaction)}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <button
                          className="card flex items-center justify-center whitespace-nowrap"
                          onClick={onSendSignedTransaction}
                          disabled={isPendingSendSignedTransaction}
                        >
                          {!isPendingSendSignedTransaction && (
                            <Image
                              width={20}
                              height={20}
                              src="/assets/arrow5.svg"
                              alt=""
                            />
                          )}
                          {isPendingSendSignedTransaction
                            ? 'Sending Transaction...'
                            : 'Send Signed Transaction'}
                        </button>
                      </div>
                      <div className="text-s text-white font-firacode">
                        Correct Submissions: {currentNum?.toString()}{' '}
                      </div>
                    </>
                  ) : (
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
                            <br />I am a mighty ledger, yet I weigh next to
                            none,
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
                          disabled={
                            preparingTransaction || isPendingSendTransaction
                          }
                        >
                          {!preparingTransaction && (
                            <Image
                              width={20}
                              height={20}
                              src="/assets/arrow5.svg"
                              alt=""
                            />
                          )}
                          {isPendingSendTransaction
                            ? 'Awaiting Approval...'
                            : preparingTransaction
                              ? 'Preparing Transaction...'
                              : 'Send Transaction'}
                        </button>
                        <button
                          className="card flex items-center justify-center whitespace-nowrap"
                          onClick={onSignTransaction}
                          disabled={
                            preparingTransaction || isPendingSignTransaction
                          }
                        >
                          {!preparingTransaction && (
                            <Image
                              width={20}
                              height={20}
                              src="/assets/arrow5.svg"
                              alt=""
                            />
                          )}
                          {preparingTransaction
                            ? 'Preparing Transaction...'
                            : isPendingSignTransaction
                              ? 'Awaiting Approval...'
                              : 'Sign Transaction'}
                        </button>
                      </div>
                      <div className="text-s text-white font-firacode">
                        Correct Submissions: {currentNum?.toString()}{' '}
                      </div>
                      <SwitchChainDemo />
                    </>
                  )
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
