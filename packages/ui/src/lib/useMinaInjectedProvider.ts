import { useCallback, useEffect, useState } from "react";
import { PublicKey } from "o1js";
import { ChainInfoArgs, SwitchChainArgs } from "@aurowallet/mina-provider";

export function useMinaInjectedProvider() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [account, setAccount] = useState<PublicKey | null>(null);
  const [network, setNetwork] = useState<ChainInfoArgs | null>(null);

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
      if (!window.mina) {
        setHasWallet(false);
        return;
      }

      const disconnected = localStorage.getItem("mina_disconnected");
      if (disconnected === "true") {
        setHasWallet(true);
        return;
      }

      window.mina.requestNetwork().then((chainInfo) => setNetwork(chainInfo));
      const base58Accounts = await window.mina.getAccounts();
      setAccountFromWalletResponse(base58Accounts);
      setIsConnected(Boolean(base58Accounts[0]));
      setHasWallet(true);
    }

    window.mina?.on("chainChanged", setNetwork);
    window.mina?.on("accountsChanged", setAccountFromWalletResponse);
    getAccount();

    return () => {
      window.mina?.off("chainChanged", setNetwork);
      window.mina?.off("accountsChanged", setAccountFromWalletResponse);
    };
  }, [setAccountFromWalletResponse]);

  const connect = useCallback(async () => {
    if (!window.mina) {
      throw Error("Wallet is not installed");
    }

    localStorage.removeItem("mina_disconnected");

    const requestAccountsResponse = await window.mina.requestAccounts();
    if (Array.isArray(requestAccountsResponse)) {
      setAccountFromWalletResponse(requestAccountsResponse);
      window.mina.requestNetwork().then((chainInfo) => setNetwork(chainInfo));
      setIsConnected(true);
    } else {
      throw Error(requestAccountsResponse.message);
    }
  }, [setAccountFromWalletResponse]);

  const switchNetwork = useCallback(async (args: SwitchChainArgs) => {
    if (!window.mina) {
      throw Error("Wallet is not installed");
    }
    const response = await window.mina.switchChain(args);
    if ("networkID" in response) {
      setNetwork(response);
    } else {
      throw Error(response.message);
    }
  }, []);

  const sendTransaction = useCallback(
    async ({
      transactionJSON,
      transactionFee,
    }: {
      transactionJSON: any;
      transactionFee: number;
    }) => {
      if (!window.mina) {
        throw Error("Wallet is not installed");
      }
      if (!isConnected) {
        throw Error("Wallet is not connected");
      }
      const result = await window.mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
          fee: transactionFee,
          memo: "",
        },
      });
      if ("hash" in result) {
        return result;
      } else {
        throw Error(
          "message" in result ? result.message : "Unknown error happened"
        );
      }
    },
    [isConnected]
  );

  const disconnect = useCallback(() => {
    setAccount(null);
    setNetwork(null);
    setIsConnected(false);
    localStorage.setItem("mina_disconnected", "true");
  }, []);

  return {
    network,
    hasWallet,
    switchNetwork,
    isConnected,
    connect,
    disconnect,
    account,
    sendTransaction,
  };
}
