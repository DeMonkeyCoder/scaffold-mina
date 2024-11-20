import { formatPublicKey } from "@/utils";
import Image from "next/image";
import { useMinaProvider } from "@/lib/ZkappContext";
import { useCallback, useState } from "react";
import { NETWORK_ID } from "@/constants/network";
import { PublicKey } from "o1js";
import { useConnect } from "@/lib/connect/react/hooks/useConnect";
import { useConnectors } from "@/lib/connect/react/hooks/useConnectors";
import { useDisconnect } from "@/lib/connect/react/hooks/useDisconnect";
import { useAccount } from "@/lib/connect/react/hooks/useAccount";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { hasWallet, networkID, switchNetwork } = useMinaProvider();

  const { connect: wagmiConnect } = useConnect();
  const connectors = useConnectors();
  const connect = useCallback(() => {
    try {
      wagmiConnect({
        connector: connectors[0],
      });
    } catch (e) {
      console.log("errrr");
      console.log(e);
    }
  }, [connectors, wagmiConnect]);
  const { disconnect } = useDisconnect();
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
            : address
            ? formatPublicKey(PublicKey.fromBase58(address))
            : "No Account"
          : "Wrong Network"
        : "Connect Wallet"}
    </button>
  );
}
