import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import ZkappWorkerClient from "./zkappWorkerClient";
import { useMinaInjectedProvider } from "@/lib/useMinaInjectedProvider";

type MinaAccountData = {
  accountExists: boolean | null;
} & ReturnType<typeof useMinaInjectedProvider>;

type ZkappContextType = {
  zkappWorkerClient: ZkappWorkerClient | null;
} & MinaAccountData;

const ZkappContext = createContext<ZkappContextType | null>(null);

export const ZkappProvider = ({ children }: { children: ReactNode }) => {
  const [zkappWorkerClient, setZkappWorkerClient] =
    useState<ZkappWorkerClient | null>(null);

  const { account, ...oiawejf } = useMinaInjectedProvider();

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
      if (account && zkappWorkerClient) {
        const res = await zkappWorkerClient.fetchAccount({
          publicKey: account,
        });
        setAccountExists(res.error == null);
      }
    })();
  }, [account, zkappWorkerClient, setAccountExists]);

  return (
    <ZkappContext.Provider
      value={{
        zkappWorkerClient,
        accountExists,
        account,
        ...oiawejf,
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
