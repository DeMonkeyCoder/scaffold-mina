import ConnectWallet from "@/components/ConnectWallet";
import styles from "@/styles/Home.module.css";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <ConnectWallet />
    </div>
  );
}
