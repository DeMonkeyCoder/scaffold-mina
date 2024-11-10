import { useCallback, useEffect, useState } from "react";
import { PublicKey } from "o1js";
import { MinaProviderClient } from "@mina-js/providers";

export function useMinaInjectedProvider() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [provider, setProvider] = useState<MinaProviderClient | null>(null);
  const [account, setAccount] = useState<PublicKey | null>(null);
  const [networkID, setNetworkID] = useState<string | null>(null);

  const setAccountFromWalletResponse = useCallback(
    (base58Accounts: string[]) => {
      if (base58Accounts[0]) {
        setAccount(PublicKey.fromBase58(base58Accounts[0]));
      }
    },
    []
  );

  useEffect(() => {
    async function getAccount() {
      if (!provider) {
        setHasWallet(false);
        return;
      }

      const disconnected = localStorage.getItem("mina_disconnected");
      if (disconnected === "true") {
        setHasWallet(true);
        return;
      }

      provider
        .request({ method: "mina_networkId" })
        .then(({ result }) => {
          setNetworkID(result);
        })
        .finally(() => {
          provider
            .request({
              method: "mina_accounts",
            })
            .then(({ result }) => {
              setAccountFromWalletResponse(result);
              setIsConnected(Boolean(result[0]));
            });
        });
      setHasWallet(true);
    }

    // provider?.on("chainChanged", setNetworkID);
    // provider?.on("accountsChanged", setAccountFromWalletResponse);
    getAccount();

    return () => {
      // provider?.off("chainChanged", setNetworkID);
      // provider?.off("accountsChanged", setAccountFromWalletResponse);
    };
  }, [provider, setAccountFromWalletResponse]);

  useEffect(() => {
    //TODO: listen to all providers
    window.addEventListener("mina:announceProvider", (event) => {
      setProvider(event.detail.provider);
    });
    window.dispatchEvent(new Event("mina:requestProvider"));
  }, []);

  const connect = useCallback(async () => {
    if (!provider) {
      throw Error("Wallet is not installed");
    }

    localStorage.removeItem("mina_disconnected");

    const requestAccountsResponse = await provider.request({
      method: "mina_requestAccounts",
    });
    if (Array.isArray(requestAccountsResponse.result)) {
      setAccountFromWalletResponse(requestAccountsResponse.result);
      provider
        .request({ method: "mina_networkId" })
        .then(({ result }) => setNetworkID(result));
      setIsConnected(true);
    } else {
      throw Error(requestAccountsResponse.result);
    }
  }, [provider, setAccountFromWalletResponse]);

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

  const disconnect = useCallback(() => {
    setAccount(null);
    setNetworkID(null);
    setIsConnected(false);
    localStorage.setItem("mina_disconnected", "true");
  }, []);

  return {
    networkID,
    hasWallet,
    switchNetwork,
    isConnected,
    connect,
    disconnect,
    account,
    sendTransaction,
  };
}
