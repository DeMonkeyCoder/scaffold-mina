import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import ZkappWorkerClient from "./zkappWorkerClient";
import { Mina, PublicKey } from "o1js";
import { useAccount } from "@/lib/connect/react/hooks/useAccount";

type MinaAccountData = {
  accountExists: boolean | null;
};

type ZkappContextType = {
  initialized: boolean;
  zkappWorkerClient: ZkappWorkerClient | null;
} & MinaAccountData;

const ZkappContext = createContext<ZkappContextType | null>(null);

export const ZkappProvider = ({ children }: { children: ReactNode }) => {
  const [zkappWorkerClient, setZkappWorkerClient] =
    useState<ZkappWorkerClient | null>(null);
  const { address } = useAccount();

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    Mina.setActiveInstance(
      Mina.Network("https://api.minascan.io/node/devnet/v1/graphql")
    );
    setInitialized(true);
  }, []);

  useEffect(() => {
    (async () => {
      if (!zkappWorkerClient) {
        const zkappWorkerClientInstance = new ZkappWorkerClient();
        await zkappWorkerClientInstance.workerReady;
        await zkappWorkerClientInstance.setActiveInstanceToDevnet();
        setZkappWorkerClient(zkappWorkerClientInstance);
      }
    })();
  }, [zkappWorkerClient]);

  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      if (address && zkappWorkerClient) {
        const res = await zkappWorkerClient.fetchAccount({
          publicKey: PublicKey.fromBase58(address),
        });
        setAccountExists(res.error == null);
      }
    })();
  }, [address, zkappWorkerClient, setAccountExists]);

  return (
    <ZkappContext.Provider
      value={{
        initialized,
        zkappWorkerClient,
        accountExists,
      }}
    >
      {children}
    </ZkappContext.Provider>
  );
};

export const useMinaProvider = (): ZkappContextType => {
  const context = useContext(ZkappContext);
  if (!context) {
    throw new Error("useMinaProvider must be used within a ZkappProvider");
  }
  return context;
};
