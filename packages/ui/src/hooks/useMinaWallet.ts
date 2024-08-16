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
      const mina = (window as any).mina;
      if (!mina) {
        setHasWallet(false);
        return;
      }
      const publicKeyBase58: string = (await mina.getAccounts())[0];
      if (publicKeyBase58) {
        setAccount(PublicKey.fromBase58(publicKeyBase58));
        setIsConnected(true);
      }
      setHasWallet(true);
    }

    getAccount();
  }, []);

  const connect = useCallback(async () => {
    const mina = (window as any).mina;
    if (!mina || !hasWallet) {
      return;
    }
    const publicKeyBase58: string = (await mina.requestAccounts())[0];
    if (publicKeyBase58) {
      setAccount(PublicKey.fromBase58(publicKeyBase58));
    }
    setIsConnected(true);
  }, [hasWallet]);

  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      if (account && zkappWorkerClient) {
        console.log("Checking if fee payer account exists...");
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
      if (!isConnected) {
        throw Error("Wallet is not connected");
      }
      if (!accountExists) {
        throw Error("Mina account does not exist");
      }
      return (window as any).mina.sendTransaction({
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
