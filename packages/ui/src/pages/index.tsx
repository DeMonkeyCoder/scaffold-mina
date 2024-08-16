import { useCallback, useState } from "react";
import GradientBG from "../components/GradientBG.js";
import styles from "../styles/Home.module.css";
import "./reactCOIServiceWorker";
import LoadingScreen from "@/components/LoadingScreen";
import { useMinaWallet } from "@/hooks/useMinaWallet";
import {
  QuestContractProvider,
  useGetQuestContractState,
  useQuestContractContext,
} from "@/context/QuestContractContext";
import { CircuitString, PublicKey } from "o1js";

enum TransactionState {
  INITIAL,
  PREPARING,
  AWAITING_USER_APPROVAL,
}

function HomeBody() {
  const { loading, prepareTransaction } = useQuestContractContext();

  const { isConnected, accountExists, sendTransaction, account } =
    useMinaWallet();

  const { data: currentNum } = useGetQuestContractState({
    // @ts-ignore
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
      const { hash } = await sendTransaction({
        transactionJSON,
        transactionFee: 0.1,
      });
      setTransactionLink(`https://minascan.io/devnet/tx/${hash}`);
    } catch (e) {
      alert(JSON.stringify(e));
    }
    setTxState(TransactionState.INITIAL);
  }, [prepareTransaction, questSolution, sendTransaction, txState]);

  return loading ? (
    <LoadingScreen />
  ) : (
    <GradientBG>
      <div className={styles.main} style={{ padding: 0 }}>
        <div className={styles.center} style={{ padding: 0 }}>
          {transactionLink && (
            <div
              className={styles.start}
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                paddingBottom: "5rem",
              }}
            >
              <a
                href={transactionLink}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "underline" }}
              >
                View transaction
              </a>
            </div>
          )}
          {isConnected ? (
            accountExists ? (
              <div style={{ justifyContent: "center", alignItems: "center" }}>
                <div
                  className={`${styles.center} text-xl mb-2`}
                  style={{ padding: 0 }}
                >
                  Solve the riddle
                </div>
                <div
                  style={{
                    textAlign: "justify",
                    textAlignLast: "justify",
                  }}
                >
                  I am a mighty ledger, yet I weigh next to none,
                  <br />
                  Verified by all, even when the work is done.
                  <br />
                  My size is constant, no matter how much I grow,
                  <br />
                  What’s my name, this protocol you need to know?
                </div>
                <div>
                  <input
                    type="text"
                    className={`p-2 my-4 rounded-l border-2 border-gray-400`}
                    placeholder="Solution"
                    value={questSolution}
                    onChange={(e) => setQuestSolution(e.target.value)}
                  />
                </div>
                <button
                  className={styles.card}
                  onClick={onSendTransaction}
                  disabled={txState !== TransactionState.INITIAL}
                >
                  {txState === TransactionState.AWAITING_USER_APPROVAL
                    ? "Awaiting Approval..."
                    : txState === TransactionState.PREPARING
                    ? "Preparing Transaction..."
                    : "Send Transaction"}
                </button>
                <div>Correct Submissions: {currentNum?.toString()} </div>
              </div>
            ) : (
              <div>
                <span style={{ paddingRight: "1rem" }}>
                  Account does not exist.
                </span>
                <a
                  href={
                    "https://faucet.minaprotocol.com/?address=" +
                    account?.toBase58()
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit the faucet to fund this fee payer account.
                </a>
              </div>
            )
          ) : (
            <div>Please connect your wallet first.</div>
          )}
        </div>
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
