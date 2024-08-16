import styles from "@/styles/Home.module.css";
import { useMinaWallet } from "@/hooks/useMinaWallet";
import { formatPublicKey } from "@/utils";


export default function ConnectWallet() {
  const { connect, hasWallet, isConnected, account } = useMinaWallet();
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
      <button className={`${styles.card} flex items-center justify-center`} onClick={connect}>
        <img src="/assets/wallet-2.svg" alt="" />
    Connect Wallet
      </button>
    );
  }
  if (account) {
    return <button className={styles.card}>{formatPublicKey(account)}</button>;
  }
  return <button className={styles.card}>No Account</button>;
}
