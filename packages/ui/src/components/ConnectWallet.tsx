import { formatPublicKey } from "@/utils";
import Image from "next/image";
import { useMinaProvider } from "@/lib/ZkappContext";
import { useState } from "react";
import { NETWORK_ID } from "@/constants/network";
import { PublicKey } from "o1js";

export default function ConnectWallet() {
  const {
    connect,
    hasWallet,
    isConnected,
    account,
    networkID,
    switchNetwork,
    disconnect,
  } = useMinaProvider();
  const [isHovered, setIsHovered] = useState(false);

  if (!hasWallet) {
    return (
      <a
        href="https://pallad.co/"
        target="_blank"
        rel="noreferrer"
        className="card flex items-center justify-center"
      >
        Install Wallet
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
        } else if (networkID !== NETWORK_ID) {
          switchNetwork(NETWORK_ID);
        } else {
          disconnect();
        }
      }}
    >
      <Image width={16} height={16} src="/assets/wallet-2.svg" alt="" />
      {isConnected
        ? networkID === NETWORK_ID
          ? isHovered
            ? "Disconnect"
            : account
            ? formatPublicKey(PublicKey.fromBase58(account))
            : "No Account"
          : "Wrong Network"
        : "Connect Wallet"}
    </button>
  );
}
