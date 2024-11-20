import { useCallback, useEffect, useState } from "react";
import { MinaProviderClient } from "@mina-js/providers";
import { useAccount } from "@/lib/connect/react/hooks/useAccount";

export function useMinaInjectedProvider() {
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [provider, setProvider] = useState<MinaProviderClient | null>(null);
  const [networkID, setNetworkID] = useState<string | null>(null);
  const { isConnected } = useAccount();

  useEffect(() => {
    async function getNetwork() {
      if (!provider) {
        setHasWallet(false);
        return;
      }

      provider.request({ method: "mina_networkId" }).then(({ result }) => {
        setNetworkID(result);
      });
      setHasWallet(true);
    }

    // provider?.on("chainChanged", setNetworkID);
    // provider?.on("accountsChanged", setAccountFromWalletResponse);
    getNetwork();

    return () => {
      // provider?.off("chainChanged", setNetworkID);
      // provider?.off("accountsChanged", setAccountFromWalletResponse);
    };
  }, [provider]);

  useEffect(() => {
    //TODO: listen to all providers
    window.addEventListener("mina:announceProvider", (event) => {
      setProvider(event.detail.provider);
    });
    window.dispatchEvent(new Event("mina:requestProvider"));
  }, []);

  const switchNetwork = useCallback(
    async (networkId: string) => {
      if (!provider) {
        throw Error("Wallet is not installed");
      }
      const { result } = await provider.request({
        method: "mina_switchChain",
        params: [networkId],
      });
      setNetworkID(result);
    },
    [provider]
  );

  const sendTransaction = useCallback(
    async ({
      transactionJSON,
      transactionFee,
    }: {
      transactionJSON: any;
      transactionFee: number;
    }) => {
      if (!provider) {
        throw Error("Wallet is not installed");
      }
      if (!isConnected) {
        throw Error("Wallet is not connected");
      }
      // const result = await provider.sendTransaction({
      //   transaction: transactionJSON,
      //   feePayer: {
      //     fee: transactionFee,
      //     memo: "",
      //   },
      // });
      // if ("hash" in result) {
      //   return result;
      // } else {
      //   throw Error(
      //     "message" in result ? result.message : "Unknown error happened"
      //   );
      // }
    },
    [isConnected, provider]
  );

  return {
    networkID,
    hasWallet,
    switchNetwork,
    sendTransaction,
  };
}
