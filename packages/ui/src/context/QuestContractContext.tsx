import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Field, PublicKey } from "o1js";
import { useZkappContext } from "@/context/ZkappContext";
import { State } from "@/pages/zkappWorker";
import { timeout } from "@/utils";

interface QuestContractContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentNum: Field | null;
  setCurrentNum: React.Dispatch<React.SetStateAction<Field | null>>;
  creatingTransaction: boolean;
  setCreatingTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  getState: (args: {
    stateVariable: keyof State["contracts"]["Quest"]["zkapp"];
  }) => Promise<Field>;
  prepareTransaction: any; //TODO: fix this type
}

const QuestContractContext = createContext<QuestContractContextType | null>(
  null
);

export const QuestContractProvider = ({
  children,
  zkappPublicKey,
}: {
  children: ReactNode;
  zkappPublicKey: PublicKey;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentNum, setCurrentNum] = useState<Field | null>(null);
  const [creatingTransaction, setCreatingTransaction] =
    useState<boolean>(false);

  const { zkappWorkerClient } = useZkappContext();

  useEffect(() => {
    (async () => {
      if (zkappWorkerClient) {
        await zkappWorkerClient.loadAndCompileContract({
          contractName: "Quest",
        });
        console.log("zkApp compiled");
        await zkappWorkerClient.initZkappInstance({
          contractName: "Quest",
          publicKey: zkappPublicKey,
        });
        setLoading(false);
      }
    })();
  }, [zkappWorkerClient, zkappPublicKey]);

  const fetchAccount = useCallback(async () => {
    if (!zkappWorkerClient) {
      throw Error("zkappWorkerClient not initialized");
    }
    await zkappWorkerClient.fetchAccount({
      publicKey: zkappPublicKey,
    });
  }, [zkappPublicKey, zkappWorkerClient]);

  const getState = useCallback(
    async ({
      stateVariable,
    }: {
      stateVariable: keyof State["contracts"]["Quest"]["zkapp"];
    }) => {
      if (!zkappWorkerClient) {
        throw Error("zkappWorkerClient not initialized");
      }
      await fetchAccount();
      return zkappWorkerClient.getState({
        contractName: "Quest",
        stateVariable,
      });
    },
    [fetchAccount, zkappWorkerClient]
  );
  const prepareTransaction = async ({
    method,
  }: {
    method: keyof State["contracts"]["Quest"]["zkapp"];
  }) => {
    if (!zkappWorkerClient) {
      throw Error("zkappWorkerClient not initialized");
    }
    await fetchAccount();
    console.log("fetchAccount done");
    return zkappWorkerClient.prepareTransaction({
      contractName: "Quest",
      method,
    });
  };

  return (
    <QuestContractContext.Provider
      value={{
        prepareTransaction,
        getState,
        loading,
        setLoading,
        currentNum,
        setCurrentNum,
        creatingTransaction,
        setCreatingTransaction,
      }}
    >
      {children}
    </QuestContractContext.Provider>
  );
};

export const useQuestContractContext = (): QuestContractContextType => {
  const context = useContext(QuestContractContext);
  if (!context) {
    throw new Error(
      "useQuestContractContext must be used within a QuestContractProvider"
    );
  }
  return context;
};

export function useGetQuestContractState({
  watch,
  stateVariable,
}: {
  watch?: boolean;
  stateVariable: keyof State["contracts"]["Quest"]["zkapp"];
}) {
  const [data, setData] = useState<Field | null>(null);
  const { loading, getState } = useQuestContractContext();
  useEffect(() => {
    let continuePolling = watch;

    async function getData() {
      const newData = await getState({
        stateVariable,
      });
      console.log({ newData: newData.toString() });
      setData(newData);
      await timeout(3);
      if (continuePolling) {
        getData();
      }
    }

    if (!loading) {
      getData();
    }
    return () => {
      continuePolling = false;
    };
  }, [getState, loading, stateVariable, watch]);
  return {
    data,
  };
}
