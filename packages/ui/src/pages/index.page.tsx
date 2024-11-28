import { useCallback, useEffect, useState } from "react";
import GradientBG from "../components/GradientBG.js";
import LoadingScreen from "@/components/LoadingScreen";
import ConnectWallet from "@/components/ConnectWallet";
import {
  QuestContractProvider,
  useGetQuestContractState,
  useQuestContract,
} from "@/lib/useQuestContract";
import { CircuitString, PublicKey } from "o1js";
import Image from "next/image";
import { useMinaProvider } from "@/lib/ZkappContext";
import { isSupportedNetwork } from "@/constants/network";
import AccountDoesNotExist from "@/components/AccountDoesNotExist";
import { useAccount } from "@/lib/connect/react/hooks/useAccount";
import { useChainId } from "@/lib/connect/react/hooks/useChainId";

enum TransactionState {
  INITIAL,
  PREPARING,
  AWAITING_USER_APPROVAL,
}

function HomeBody() {
  const { loading, prepareTransaction } = useQuestContract();
  const { address, isConnected } = useAccount();

  const { accountExists } = useMinaProvider();
  const networkId = useChainId();

  const { data: currentNum } = useGetQuestContractState({
    stateVariable: "counter",
    watch: true,
  });

  const [questSolution, setQuestSolution] = useState("");

  const [txState, setTxState] = useState(TransactionState.INITIAL);
  const [transactionLink, setTransactionLink] = useState("");
  const onSendTransaction = useCallback(async () => {
    if (txState !== TransactionState.INITIAL) return;
    try {
      setTxState(TransactionState.PREPARING);
      const transactionJSON = await prepareTransaction({
        method: "solve",
        args: [CircuitString.fromString(questSolution.toLowerCase()).hash()],
      });
      setTxState(TransactionState.AWAITING_USER_APPROVAL);
      // const { hash } = await sendTransaction({
      //   transactionJSON,
      //   transactionFee: 0.1,
      // });
      // setTransactionLink(`https://minascan.io/devnet/tx/${hash}`);
    } catch (e) {
      alert(JSON.stringify(e));
    }
    setTxState(TransactionState.INITIAL);
  }, [prepareTransaction, questSolution, txState]);

  useEffect(() => {
    setTransactionLink("");
  }, [address]);

  return (
    <GradientBG>
      <div className="main">
        {loading ? (
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
                    <div className="riddle-box bg-purple-50">
                      <div className="justify-center items-center">
                        <div className="text-center text-2xl mb-2 flex items-center justify-center p-0">
                          Solve the riddle{" "}
                          <img
                            className="px-2 w-11"
                            src="/assets/thinkingface.svg"
                            alt=""
                          />
                        </div>
                        <div className="text-justify text-last-justify">
                          <br />
                          I am a mighty ledger, yet I weigh next to none,
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
                            width={16}
                            height={16}
                            src="/assets/upload-circle-01-stroke-rounded.svg"
                            alt=""
                          />
                        )}
                        {txState === TransactionState.AWAITING_USER_APPROVAL
                          ? "Awaiting Approval..."
                          : txState === TransactionState.PREPARING
                          ? "Preparing Transaction..."
                          : "Send Transaction"}
                      </button>
                    </div>
                    <div>Correct Submissions: {currentNum?.toString()} </div>
                  </>
                ) : (
                  <AccountDoesNotExist />
                )
              ) : (
                <div>
                  Please change your wallet network to Devnet
                  <div className="flex items-center justify-center">
                    <ConnectWallet />
                  </div>
                </div>
              )
            ) : (
              <div className="welcome">
                <div>Welcome to</div>
                <div className="flex items-center justify-center text-2xl font-semibold mr-6">
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
                <ConnectWallet />
              </div>
            )}
          </div>
        )}
      </div>
    </GradientBG>
  );
}

export default function Home() {
  return (
    <QuestContractProvider
      zkappPublicKey={PublicKey.fromBase58(
        "B62qjDnppFhY5tsEmLbCDRniCoJcYqLmHpEeXVfwM4Ej18uJFhTrmBb"
      )}
    >
      <HomeBody />
    </QuestContractProvider>
  );
}
