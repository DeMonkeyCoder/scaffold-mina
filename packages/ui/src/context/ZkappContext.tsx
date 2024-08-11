import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Field, PublicKey } from "o1js";
import ZkappWorkerClient from "../pages/zkappWorkerClient";

interface ZkappContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  zkappWorkerClient: ZkappWorkerClient | null;
  setZkappWorkerClient: React.Dispatch<
    React.SetStateAction<ZkappWorkerClient | null>
  >;
  hasBeenSetup: boolean;
  setHasBeenSetup: React.Dispatch<React.SetStateAction<boolean>>;
  currentNum: Field | null;
  setCurrentNum: React.Dispatch<React.SetStateAction<Field | null>>;
  zkappPublicKey: PublicKey;
  creatingTransaction: boolean;
  setCreatingTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}

const ZkappContext = createContext<ZkappContextType | null>(null);

export const ZkappProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [zkappWorkerClient, setZkappWorkerClient] =
    useState<ZkappWorkerClient | null>(null);
  const [hasBeenSetup, setHasBeenSetup] = useState<boolean>(false);
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
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }

    (async () => {
      if (!hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();
        await timeout(5);
        setZkappWorkerClient(zkappWorkerClient);
        console.log("Done loading web worker");
        await zkappWorkerClient.setActiveInstanceToDevnet();
        await zkappWorkerClient.loadContract();
        console.log("Compiling zkApp...");
        await zkappWorkerClient.compileContract();
        console.log("zkApp compiled");
        await zkappWorkerClient.initZkappInstance(zkappPublicKey);
        console.log("Getting zkApp state...");
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        const currentNum = await zkappWorkerClient.getNum();
        console.log(`Current state in zkApp: ${currentNum.toString()}`);
        setHasBeenSetup(true);
        setLoading(false);
        setCurrentNum(currentNum);
      }
    })();
  }, [hasBeenSetup, zkappPublicKey]);

  return (
    <ZkappContext.Provider
      value={{
        loading,
        setLoading,
        zkappWorkerClient,
        setZkappWorkerClient,
        hasBeenSetup,
        setHasBeenSetup,
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
