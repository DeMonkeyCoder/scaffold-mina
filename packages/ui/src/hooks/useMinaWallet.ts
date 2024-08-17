import { useCallback, useEffect, useState } from "react";
import { PublicKey } from "o1js";
import { useZkappContext } from "@/lib/ZkappContext";

export function useMinaWallet() {
  const { zkappWorkerClient } = useZkappContext();

  const [isConnected, setIsConnected] = useState(false);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [account, setAccount] = useState<PublicKey | null>(null);

  useEffect(() => {
    async function getAccount() {
      if (!window.mina) {
        setHasWallet(false);
        return;
      }
      const publicKeyBase58: string = (await window.mina.getAccounts())[0];
      if (publicKeyBase58) {
        setAccount(PublicKey.fromBase58(publicKeyBase58));
        setIsConnected(true);
      }
      setHasWallet(true);
    }

    getAccount();
  }, []);

  const connect = useCallback(async () => {
    if (!window.mina) {
      throw Error("Wallet is not installed");
    }
    const requestAccountsResponse = await window.mina.requestAccounts();
    if (Array.isArray(requestAccountsResponse)) {
      const publicKeyBase58 = requestAccountsResponse[0];
      if (publicKeyBase58) {
        setAccount(PublicKey.fromBase58(publicKeyBase58));
      }
      setIsConnected(true);
    } else {
      throw Error(requestAccountsResponse.message);
    }
  }, []);

  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      if (account && zkappWorkerClient) {
        const res = await zkappWorkerClient!.fetchAccount({
          publicKey: account,
        });
        setAccountExists(res.error == null);
      }
    })();
  }, [account, zkappWorkerClient, setAccountExists]);

  const sendTransaction = useCallback(
    ({
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
      if (!accountExists) {
        throw Error("Mina account does not exist");
      }
      return window.mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
          fee: transactionFee,
          memo: "",
        },
      });
    },
    [accountExists, isConnected]
  );

  return {
    sendTransaction,
    hasWallet,
    account,
    accountExists,
    isConnected,
    connect,
  };
}
