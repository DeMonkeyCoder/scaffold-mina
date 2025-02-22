import AccountDoesNotExist from '@/components/AccountDoesNotExist'
import { ConnectWallet } from '@/components/ConnectWallet'
import { useMinaProvider } from '@/lib/ZkappContext'
import { useAccount } from '@/lib/connect/react/hooks/useAccount'
import { useSendSignedTransaction } from '@/lib/connect/react/hooks/useSendSignedTransaction'
import { useSendTransaction } from '@/lib/connect/react/hooks/useSendTransaction'
import { useSignDelegationTransaction } from '@/lib/connect/react/hooks/useSignDelegationTransaction'
import { useSignPaymentTransaction } from '@/lib/connect/react/hooks/useSignPaymentTransaction'
import { useTransactionCount } from '@/lib/connect/react/hooks/useTransactionCount'
import type {
  TransactionRequestDelegationSigned,
  TransactionRequestPaymentSigned,
} from '@/lib/connect/viem/types/transaction'
import { isSupportedNetwork } from '@/utils'
import { parseMina } from '@mina-js/utils'
import { useAppKitNetwork } from '@reown/appkit/react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import GradientBG from '../components/GradientBG.js'

export default function TxDemo() {
  const { address, isConnected } = useAccount()

  const { accountExists } = useMinaProvider()
  const { chainId: networkId } = useAppKitNetwork()

  const [to, setTo] = useState(
    'B62qnVUL6A53E4ZaGd3qbTr6RCtEZYTu3kTijVrrquNpPo4d3MuJ3nb',
  )
  const [amount, setAmount] = useState('3')
  const [fee, setFee] = useState('0.1')
  const [memo, setMemo] = useState('Hello from Mina!')
  const [nonce, setNonce] = useState('0')

  const { data: transactionCount } = useTransactionCount({
    address,
    watch: true,
  })
  useEffect(() => {
    if (transactionCount) {
      setNonce(String(transactionCount))
    }
  }, [transactionCount])

  const [transactionLink, setTransactionLink] = useState('')

  const {
    sendTransaction,
    isPending: isPendingSendTransaction,
    data: txHash,
  } = useSendTransaction()
  const onSendPayment = useCallback(async () => {
    if (isPendingSendTransaction) return
    sendTransaction({
      type: 'payment',
      to,
      fee: parseMina(fee),
      amount: parseMina(amount),
      nonce,
      memo,
    })
  }, [amount, fee, isPendingSendTransaction, memo, nonce, sendTransaction, to])

  const onSendDelegation = useCallback(async () => {
    if (isPendingSendTransaction) return
    sendTransaction({
      type: 'delegation',
      to,
      fee: parseMina(fee),
      nonce,
      memo,
    })
  }, [fee, isPendingSendTransaction, memo, nonce, sendTransaction, to])

  useEffect(() => {
    setTransactionLink(`https://minascan.io/devnet/tx/${txHash}`)
  }, [txHash])

  const {
    signTransaction: signPayment,
    isPending: isPendingSignPayment,
    data: paymentSignature,
  } = useSignPaymentTransaction()

  const onSignPayment = useCallback(async () => {
    if (isPendingSignPayment) return
    signPayment({
      to,
      fee: parseMina(fee),
      amount: parseMina(amount),
      nonce,
      memo,
    })
  }, [amount, fee, isPendingSignPayment, memo, nonce, signPayment, to])

  const {
    signTransaction: signDelegation,
    isPending: isPendingSignDelegation,
    data: delegationSignature,
  } = useSignDelegationTransaction()

  const onSignDelegation = useCallback(async () => {
    if (isPendingSignDelegation) return
    signDelegation({
      to,
      fee: parseMina(fee),
      nonce,
      memo,
    })
  }, [fee, isPendingSignDelegation, memo, nonce, signDelegation, to])

  const {
    sendSignedTransaction,
    isPending: isPendingSendSignedTransaction,
    data: signedTxHash,
  } = useSendSignedTransaction()

  useEffect(() => {
    setTransactionLink(`https://minascan.io/devnet/tx/${signedTxHash}`)
  }, [signedTxHash])

  const signedTransaction = useMemo(() => {
    if (!address) return null
    if (paymentSignature) {
      return {
        type: 'payment',
        signature: paymentSignature,
        input: {
          from: address,
          to,
          fee: parseMina(fee),
          amount: parseMina(amount),
          nonce,
          memo,
        },
      } satisfies TransactionRequestPaymentSigned
    }
    if (delegationSignature) {
      return {
        type: 'delegation',
        signature: delegationSignature,
        input: {
          from: address,
          to,
          fee: parseMina(fee),
          nonce,
          memo,
        },
      } satisfies TransactionRequestDelegationSigned
    }
  }, [
    address,
    amount,
    delegationSignature,
    fee,
    memo,
    nonce,
    paymentSignature,
    to,
  ])

  const onSendSignedTransaction = useCallback(async () => {
    if (!signedTransaction || isPendingSendSignedTransaction) return
    sendSignedTransaction(signedTransaction)
  }, [isPendingSendSignedTransaction, sendSignedTransaction, signedTransaction])

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
                signedTransaction ? (
                  <>
                    <div className="riddle-box bg-gradient-to-tr from-black/60 to-blue-800/60 border m-8">
                      <div className="justify-center items-center">
                        <textarea
                          cols={60}
                          rows={10}
                          value={JSON.stringify({
                            ...signedTransaction,
                            input: {
                              ...signedTransaction.input,
                              fee: signedTransaction.input.fee?.toString(),
                              amount:
                                signedTransaction.input.amount?.toString(),
                            },
                          })}
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
                  </>
                ) : (
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
                          onChange={(e) => setAmount(e.target.value)}
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
                          onChange={(e) => setFee(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-white" htmlFor="tx-nonce">
                          Nonce:
                        </label>
                        <input
                          id="tx-nonce"
                          type="number"
                          className="p-2 ml-2 my-4 rounded-l border-2 border-gray-400 w-56 h-11"
                          placeholder="Nonce"
                          value={nonce}
                          onChange={(e) => setNonce(e.target.value)}
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
                        disabled={isPendingSendTransaction}
                      >
                        <Image
                          width={20}
                          height={20}
                          src="/assets/arrow5.svg"
                          alt=""
                        />
                        {isPendingSendTransaction
                          ? 'Awaiting Approval...'
                          : 'Send Payment'}
                      </button>
                      <button
                        className="card flex items-center justify-center whitespace-nowrap"
                        onClick={onSignPayment}
                        disabled={isPendingSignPayment}
                      >
                        <Image
                          width={20}
                          height={20}
                          src="/assets/arrow5.svg"
                          alt=""
                        />
                        {isPendingSignPayment
                          ? 'Awaiting Approval...'
                          : 'Sign Payment'}
                      </button>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        className="card flex items-center justify-center whitespace-nowrap"
                        onClick={onSendDelegation}
                        disabled={isPendingSendTransaction}
                      >
                        <Image
                          width={20}
                          height={20}
                          src="/assets/arrow5.svg"
                          alt=""
                        />
                        {isPendingSendTransaction
                          ? 'Awaiting Approval...'
                          : 'Send Delegation'}
                      </button>
                      <button
                        className="card flex items-center justify-center whitespace-nowrap"
                        onClick={onSignDelegation}
                        disabled={isPendingSignDelegation}
                      >
                        <Image
                          width={20}
                          height={20}
                          src="/assets/arrow5.svg"
                          alt=""
                        />
                        {isPendingSignDelegation
                          ? 'Awaiting Approval...'
                          : 'Sign Delegation'}
                      </button>
                    </div>
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
