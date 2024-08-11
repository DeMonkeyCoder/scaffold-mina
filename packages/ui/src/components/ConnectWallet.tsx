import styles from "@/styles/Home.module.css";
import { useMina } from "@/hooks/useMina";
import { formatPublicKey } from "@/utils";

export default function ConnectWallet() {
  const { connect, hasWallet, isConnected, account } = useMina();
  if (!hasWallet) {
    return (
      <a
        href="https://www.aurowallet.com"
        target="_blank"
        rel="noreferrer"
        className={styles.card}
      >
        Install Auro Wallet
      </a>
    );
  }
  if (!isConnected) {
    return (
      <button className={styles.card} onClick={connect}>
        Connect Wallet
      </button>
    );
  }
  if (account) {
    return <button className={styles.card}>{formatPublicKey(account)}</button>;
  }
  return <button className={styles.card}>No Account</button>;
}
