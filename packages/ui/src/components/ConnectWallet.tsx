import { formatPublicKey } from "@/utils";
import Image from "next/image";
import { useMinaProvider } from "@/lib/ZkappContext";

export default function ConnectWallet() {
  const { connect, hasWallet, isConnected, account } = useMinaProvider();
  if (!hasWallet) {
    return (
      <a
        href="https://www.aurowallet.com"
        target="_blank"
        rel="noreferrer"
        className="card flex items-center justify-center"
      >
        Install Auro Wallet
      </a>
    );
  }

  return (
    <button
      className="card flex items-center justify-center"
      onClick={() => {
        if (!isConnected) {
          connect();
        }
      }}
    >
      <Image width={16} height={16} src="/assets/wallet-2.svg" alt="" />
      {isConnected
        ? account
          ? formatPublicKey(account)
          : "No Account"
        : "Connect Wallet"}
    </button>
  );
}
