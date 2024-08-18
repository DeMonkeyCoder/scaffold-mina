import { formatPublicKey } from "@/utils";
import Image from "next/image";
import { useMinaProvider } from "@/lib/ZkappContext";
import { NETWORK_ID } from "@/constants/network";

export default function ConnectWallet() {
  const { connect, hasWallet, isConnected, account, network, switchNetwork } =
    useMinaProvider();
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
        } else if (network?.networkID !== NETWORK_ID) {
          switchNetwork({ networkID: NETWORK_ID });
        }
      }}
    >
      <Image width={16} height={16} src="/assets/wallet-2.svg" alt="" />
      {isConnected
        ? network?.networkID === NETWORK_ID
          ? account
            ? formatPublicKey(account)
            : "No Account"
          : "Wrong Network"
        : "Connect Wallet"}
    </button>
  );
}
