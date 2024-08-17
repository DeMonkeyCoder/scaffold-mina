import { useCallback, useEffect, useState } from "react";
import { PublicKey } from "o1js";

export function useMinaInjectedProvider() {
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
      console.log({ publicKeyBase58 });
      if (publicKeyBase58) {
        setAccount(PublicKey.fromBase58(publicKeyBase58));
      }
      setIsConnected(true);
    } else {
      throw Error(requestAccountsResponse.message);
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

  return {
    sendTransaction,
    hasWallet,
    account,
    isConnected,
    connect,
  };
}
