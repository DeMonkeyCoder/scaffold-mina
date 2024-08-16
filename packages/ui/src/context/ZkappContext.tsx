import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import ZkappWorkerClient from "../pages/zkappWorkerClient";
import { timeout } from "@/utils";

interface ZkappContextType {
  zkappWorkerClient: ZkappWorkerClient | null;
}

const ZkappContext = createContext<ZkappContextType | null>(null);

export const ZkappProvider = ({ children }: { children: ReactNode }) => {
  const [zkappWorkerClient, setZkappWorkerClient] =
    useState<ZkappWorkerClient | null>(null);

  useEffect(() => {
    (async () => {
      if (!zkappWorkerClient) {
        const zkappWorkerClientInstance = new ZkappWorkerClient();
        await timeout(5);
        await zkappWorkerClientInstance.setActiveInstanceToDevnet();
        setZkappWorkerClient(zkappWorkerClientInstance);
      }
    })();
  }, [zkappWorkerClient]);

  return (
    <ZkappContext.Provider
      value={{
        zkappWorkerClient,
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
