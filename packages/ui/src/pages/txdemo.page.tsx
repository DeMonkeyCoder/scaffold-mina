import AccountDoesNotExist from '@/components/AccountDoesNotExist'
import {ConnectWallet} from '@/components/ConnectWallet'
import {config} from '@/config'
import {useMinaProvider} from '@/lib/ZkappContext'
import {sendTransaction} from '@/lib/connect/core/exports'
import {isSupportedNetwork} from '@/utils'
import {useAppKitAccount, useAppKitNetwork} from '@reown/appkit/react'
import Image from 'next/image'
import {useCallback, useEffect, useState} from 'react'
import GradientBG from '../components/GradientBG.js'

enum TransactionState {
  INITIAL = 0,
  PREPARING = 1,
  AWAITING_USER_APPROVAL = 2,
}

export default function TxDemo() {
  const { address, isConnected } = useAppKitAccount()

  const { accountExists } = useMinaProvider()
  const { chainId: networkId } = useAppKitNetwork()

  const [to, setTo] = useState(
    'B62qnVUL6A53E4ZaGd3qbTr6RCtEZYTu3kTijVrrquNpPo4d3MuJ3nb',
  )
  const [amount, setAmount] = useState(3)
  const [fee, setFee] = useState(0.1)
  const [memo, setMemo] = useState('Hello from Mina!')

  const [txState, setTxState] = useState(TransactionState.INITIAL)
  const [transactionLink, setTransactionLink] = useState('')

  const onSendPayment = useCallback(async () => {
    if (txState !== TransactionState.INITIAL) return
    try {
      setTxState(TransactionState.AWAITING_USER_APPROVAL)
      const hash = await sendTransaction(config, {
        type: 'payment',
        to,
        fee,
        amount,
        memo,
      })
      setTransactionLink(`https://minascan.io/devnet/tx/${hash}`)
    } catch (e) {
      alert(String(e))
    }
    setTxState(TransactionState.INITIAL)
  }, [amount, fee, memo, to, txState])

  const onSendDelegation = useCallback(async () => {
    if (txState !== TransactionState.INITIAL) return
    try {
      setTxState(TransactionState.AWAITING_USER_APPROVAL)
      const hash = await sendTransaction(config, {
        type: 'delegation',
        to,
        fee,
        memo,
      })
      setTransactionLink(`https://minascan.io/devnet/tx/${hash}`)
    } catch (e) {
      alert(String(e))
    }
    setTxState(TransactionState.INITIAL)
  }, [fee, memo, to, txState])

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setTransactionLink('')
  }, [address])

  return (
    <GradientBG>
      <div className="main">
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
                        Tx Demo
                      </div>
                    </div>
                    <div>
                      <label className="text-white" htmlFor="tx-to">
                        To:
                      </label>
                      <input
                        id="tx-to"
                        type="text"
                        className="p-2 ml-2 my-4 rounded-l border-2 border-gray-400 w-56 h-11"
                        placeholder="To"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-white" htmlFor="tx-amount">
                        Amount:
                      </label>
                      <input
                        id="tx-amount"
                        type="number"
                        className="p-2 ml-2 my-4 rounded-l border-2 border-gray-400 w-56 h-11"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-white" htmlFor="tx-fee">
                        Fee:
                      </label>
                      <input
                        id="tx-fee"
                        type="number"
                        className="p-2 ml-2 my-4 rounded-l border-2 border-gray-400 w-56 h-11"
                        placeholder="Fee"
                        value={fee}
                        onChange={(e) => setFee(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-white" htmlFor="tx-memo">
                        Memo:
                      </label>
                      <input
                        id="tx-memo"
                        type="text"
                        className="p-2 ml-2 my-4 rounded-l border-2 border-gray-400 w-56 h-11"
                        placeholder="Memo"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="card flex items-center justify-center whitespace-nowrap"
                      onClick={onSendPayment}
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
                          : 'Send Payment'}
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="card flex items-center justify-center whitespace-nowrap"
                      onClick={onSendDelegation}
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
                          : 'Send Delegation'}
                    </button>
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
                <img className="px-2 w-12" src="/assets/minalogo.png" alt="" />
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
      </div>
    </GradientBG>
  )
}
