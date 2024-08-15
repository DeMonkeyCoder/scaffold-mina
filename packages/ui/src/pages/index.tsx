import { useState } from "react";
import GradientBG from "../components/GradientBG.js";
import styles from "../styles/Home.module.css";
import "./reactCOIServiceWorker";
import LoadingScreen from "@/components/LoadingScreen";
import { useZkappContext } from "@/context/ZkappContext";
import { useMinaWallet } from "@/hooks/useMinaWallet";
import {
  QuestContractProvider,
  useGetQuestContractState,
  useQuestContractContext,
} from "@/context/QuestContractContext";
import { PublicKey } from "o1js";

function HomeBody() {
  const {
    setCreatingTransaction,
    setZkappWorkerClient,
    zkappPublicKey,
    ...state
  } = useZkappContext();
  const { loading, prepareTransaction } = useQuestContractContext();

  const { accountExists, account, sendTransaction } = useMinaWallet();
  const { data: currentNum } = useGetQuestContractState({
    stateVariable: "counter" as never,
    watch: true,
  });

  const [displayText, setDisplayText] = useState("");
  const [transactionlink, setTransactionLink] = useState("");

  // -------------------------------------------------------
  // Send a transaction

  const onSendTransaction = async () => {
    setCreatingTransaction(true);
    setDisplayText("Preparing transaction...");
    const transactionJSON = await prepareTransaction({
      method: "update" as never,
    });
    setDisplayText("Waiting for user approval...");
    const { hash } = await sendTransaction({
      transactionJSON,
      transactionFee: 0.1,
    });
    const transactionLink = `https://minascan.io/devnet/tx/${hash}`;
    console.log(`View transaction at ${transactionLink}`);
    setTransactionLink(transactionLink);
    setDisplayText(transactionLink);
    setCreatingTransaction(false);
  };

  const stepDisplay = transactionlink ? (
    <a
      href={transactionlink}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: "underline" }}
    >
      View transaction
    </a>
  ) : (
    displayText
  );

  let setup = (
    <div
      className={styles.start}
      style={{ fontWeight: "bold", fontSize: "1.5rem", paddingBottom: "5rem" }}
    >
      {stepDisplay}
    </div>
  );

  let AccountDoesNotExist;
  if (!loading && !accountExists) {
    const faucetLink =
      "https://faucet.minaprotocol.com/?address=" + account?.toBase58();
    AccountDoesNotExist = (
      <div>
        {String(accountExists)}
        <span style={{ paddingRight: "1rem" }}>Account does not exist.</span>
        <a href={faucetLink} target="_blank" rel="noreferrer">
          Visit the faucet to fund this fee payer account.
        </a>
      </div>
    );
  }

  let MainContent;
  if (!loading && accountExists) {
    MainContent = (
      <div style={{ justifyContent: "center", alignItems: "center" }}>
        <div className={styles.center} style={{ padding: 0 }}>
          Current state in zkApp: {currentNum?.toString()}{" "}
        </div>
        <button
          className={styles.card}
          onClick={onSendTransaction}
          disabled={state.creatingTransaction}
        >
          Send Transaction
        </button>
      </div>
    );
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <GradientBG>
      <div className={styles.main} style={{ padding: 0 }}>
        <div className={styles.center} style={{ padding: 0 }}>
          {setup}
          {AccountDoesNotExist}
          {MainContent}
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
