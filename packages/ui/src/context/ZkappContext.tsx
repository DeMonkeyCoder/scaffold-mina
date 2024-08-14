import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Field, PublicKey } from "o1js";
import ZkappWorkerClient from "../pages/zkappWorkerClient";
import { timeout } from "@/utils";

interface ZkappContextType {
  zkappWorkerClient: ZkappWorkerClient | null;
  setZkappWorkerClient: React.Dispatch<
    React.SetStateAction<ZkappWorkerClient | null>
  >;
  currentNum: Field | null;
  setCurrentNum: React.Dispatch<React.SetStateAction<Field | null>>;
  zkappPublicKey: PublicKey;
  creatingTransaction: boolean;
  setCreatingTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}

const ZkappContext = createContext<ZkappContextType | null>(null);

export const ZkappProvider = ({ children }: { children: ReactNode }) => {
  const [zkappWorkerClient, setZkappWorkerClient] =
    useState<ZkappWorkerClient | null>(null);
  const [currentNum, setCurrentNum] = useState<Field | null>(null);
  const [zkappPublicKey] = useState<PublicKey>(
    PublicKey.fromBase58(
      "B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP"
    )
  );
  const [creatingTransaction, setCreatingTransaction] =
    useState<boolean>(false);

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    (async () => {
      if (!zkappWorkerClient) {
        const zkappWorkerClientInstance = new ZkappWorkerClient();
        await timeout(5);
        await zkappWorkerClientInstance.setActiveInstanceToDevnet();
        setZkappWorkerClient(zkappWorkerClientInstance);
      }
    })();
  }, [zkappWorkerClient, zkappPublicKey]);

  return (
    <ZkappContext.Provider
      value={{
        zkappWorkerClient,
        setZkappWorkerClient,
        currentNum,
        setCurrentNum,
        zkappPublicKey,
        creatingTransaction,
        setCreatingTransaction,
      }}
    >
      {children}
    </ZkappContext.Provider>
  );
};

export const useZkappContext = (): ZkappContextType => {
  const context = useContext(ZkappContext);
  if (!context) {
    throw new Error("useZkappContext must be used within a ZkappProvider");
  }
  return context;
};
