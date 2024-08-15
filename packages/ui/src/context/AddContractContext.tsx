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

interface AddContractContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentNum: Field | null;
  setCurrentNum: React.Dispatch<React.SetStateAction<Field | null>>;
  zkappPublicKey: PublicKey;
  creatingTransaction: boolean;
  setCreatingTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  getState: (args: {
    stateVariable: keyof State["contracts"]["Add"]["zkapp"];
  }) => Promise<Field>;
}

const AddContractContext = createContext<AddContractContextType | null>(null);

export const AddContractProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentNum, setCurrentNum] = useState<Field | null>(null);
  const [zkappPublicKey] = useState<PublicKey>(
    PublicKey.fromBase58(
      "B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP"
    )
  );
  const [creatingTransaction, setCreatingTransaction] =
    useState<boolean>(false);

  const { zkappWorkerClient } = useZkappContext();

  useEffect(() => {
    (async () => {
      if (zkappWorkerClient) {
        await zkappWorkerClient.loadAndCompileContract({
          contractName: "Add",
        });
        console.log("zkApp compiled");
        await zkappWorkerClient.initZkappInstance({
          contractName: "Add",
          publicKey: zkappPublicKey,
        });
        console.log("Getting zkApp state...");
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        const currentNum = await zkappWorkerClient.getNum();
        console.log(`Current state in zkApp: ${currentNum.toString()}`);
        setLoading(false);
        setCurrentNum(currentNum);
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
      stateVariable: keyof State["contracts"]["Add"]["zkapp"];
    }) => {
      if (!zkappWorkerClient) {
        throw Error("zkappWorkerClient not initialized");
      }
      await fetchAccount();
      return zkappWorkerClient.getState({
        contractName: "Add",
        stateVariable,
      });
    },
    [fetchAccount, zkappWorkerClient]
  );

  return (
    <AddContractContext.Provider
      value={{
        getState,
        loading,
        setLoading,
        currentNum,
        setCurrentNum,
        zkappPublicKey,
        creatingTransaction,
        setCreatingTransaction,
      }}
    >
      {children}
    </AddContractContext.Provider>
  );
};

export const useAddContractContext = (): AddContractContextType => {
  const context = useContext(AddContractContext);
  if (!context) {
    throw new Error(
      "useAddContractContext must be used within a AddContractProvider"
    );
  }
  return context;
};

export function useGetAddContractState({
  watch,
  stateVariable,
}: {
  watch?: boolean;
  stateVariable: keyof State["contracts"]["Add"]["zkapp"];
}) {
  const [data, setData] = useState<Field | null>(null);
  const { loading, getState } = useAddContractContext();
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
