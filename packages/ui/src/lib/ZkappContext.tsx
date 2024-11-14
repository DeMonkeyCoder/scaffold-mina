import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ZkappWorkerClient from "./zkappWorkerClient";
import { useMinaInjectedProvider } from "@/lib/useMinaInjectedProvider";
import { useAccount } from "@/lib/connect/react/hooks/useAccount";
import { PublicKey } from "o1js";
import { useConnect } from "@/lib/connect/react/hooks/useConnect";
import { useConnectors } from "@/lib/connect/react/hooks/useConnectors";

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

  const { address: account, isConnected } = useAccount();
  const { connect: wagmiConnect } = useConnect();
  const connectors = useConnectors();
  const connect = useCallback(() => {
    try {
      wagmiConnect({
        connector: connectors[0],
      });
    } catch (e) {
      console.log("errrr");
      console.log(e);
    }
  }, [connectors, wagmiConnect]);
  const { networkID, hasWallet, switchNetwork, disconnect, sendTransaction } =
    useMinaInjectedProvider();

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
          publicKey: PublicKey.fromBase58(account),
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
        networkID,
        hasWallet,
        switchNetwork,
        isConnected,
        connect,
        disconnect,
        sendTransaction,
        account,
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
