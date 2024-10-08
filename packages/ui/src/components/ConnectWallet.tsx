import { formatPublicKey } from "@/utils";
import Image from "next/image";
import { useMinaProvider } from "@/lib/ZkappContext";
import { NETWORK_ID } from "@/constants/network";
import { useState } from "react";

export default function ConnectWallet() {
  const {
    connect,
    hasWallet,
    isConnected,
    account,
    network,
    switchNetwork,
    disconnect,
  } = useMinaProvider();
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!isConnected) {
          connect();
        } else if (network?.networkID !== NETWORK_ID) {
          switchNetwork({ networkID: NETWORK_ID });
        } else {
          disconnect();
        }
      }}
    >
      <Image width={16} height={16} src="/assets/wallet-2.svg" alt="" />
      {isConnected
        ? network?.networkID === NETWORK_ID
          ? isHovered
            ? "Disconnect"
            : account
            ? formatPublicKey(account)
            : "No Account"
          : "Wrong Network"
        : "Connect Wallet"}
    </button>
  );
}
