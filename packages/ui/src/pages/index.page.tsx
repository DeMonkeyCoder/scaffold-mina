import { useCallback, useState } from "react";
import GradientBG from "../components/GradientBG.js";
import LoadingScreen from "@/components/LoadingScreen";
import {
  QuestContractProvider,
  useGetQuestContractState,
  useQuestContract,
} from "@/lib/useQuestContract";
import { PublicKey } from "o1js";
import Image from "next/image";
import { useMinaProvider } from "@/lib/ZkappContext";
import { isSupportedNetwork } from "@/constants/network";
import AccountDoesNotExist from "@/components/AccountDoesNotExist";

enum TransactionState {
  INITIAL,
  PREPARING,
  AWAITING_USER_APPROVAL,
}

function HomeBody() {
  const { loading, prepareTransaction } = useQuestContract();

  const { isConnected, accountExists, sendTransaction, networkID } =
    useMinaProvider();

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
      // const transactionJSON = await prepareTransaction({
      //   method: "solve",
      //   args: [CircuitString.fromString(questSolution.toLowerCase()).hash()],
      // });
      // console.log(JSON.parse(transactionJSON));
      setTxState(TransactionState.AWAITING_USER_APPROVAL);
      const result = await sendTransaction();
      // setTransactionLink(`https://minascan.io/devnet/tx/${result.hash}`);
    } catch (e) {
      console.log("Error:");
      console.log(e);
      alert(JSON.stringify(e));
    }
    setTxState(TransactionState.INITIAL);
  }, [prepareTransaction, questSolution, sendTransaction, txState]);

  return (
    <GradientBG>
      <div className="main">
        {loading ? (
          <LoadingScreen />
        ) : (
          <div className="center">
            {transactionLink && (
              <div className="start text-2xl font-bold pb-10 underline">
                <a href={transactionLink} target="_blank" rel="noreferrer">
                  View transaction
                </a>
              </div>
            )}
            {isConnected ? (
              isSupportedNetwork(networkID) ? (
                accountExists ? (
                  <>
                    <div className="riddle-box">
                      <div className="justify-center items-center">
                        <div className="text-center text-2xl mb-2 flex items-center justify-center p-0">
                          Solve the riddle{" "}
                          <img
                            className="px-2"
                            src="/assets/face-smile-2.svg"
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
                          className="p-2 my-4 rounded-l border-2 border-gray-400 w-56"
                          placeholder="Solution"
                          value={questSolution}
                          onChange={(e) => setQuestSolution(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        className="card flex items-center justify-center"
                        onClick={onSendTransaction}
                        disabled={txState !== TransactionState.INITIAL}
                      >
                        <Image
                          width={16}
                          height={16}
                          src="/assets/upload-circle-01-stroke-rounded.svg"
                          alt=""
                        />
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
                  Wrong network. Please change your wallet network to Devnet
                </div>
              )
            ) : (
              <div>Please connect your wallet first.</div>
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
