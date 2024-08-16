import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Field, PublicKey } from "o1js";
import { useZkappContext } from "@/lib/ZkappContext";
import { timeout } from "@/utils";
import { ContractContextType, Methods, StateVariables } from "@/lib/types";
import { Quest } from "../../../contracts";

const QuestContractContext = createContext<ContractContextType<Quest> | null>(
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
    async ({ stateVariable }: { stateVariable: StateVariables<Quest> }) => {
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
    args,
  }: {
    method: Methods<Quest>;
    args?: Field[];
  }) => {
    if (!zkappWorkerClient) {
      throw Error("zkappWorkerClient not initialized");
    }
    await fetchAccount();
    console.log("fetchAccount done");
    return zkappWorkerClient.prepareTransaction({
      contractName: "Quest",
      method,
      args,
    });
  };

  return (
    <QuestContractContext.Provider
      value={{
        prepareTransaction,
        getState,
        loading,
      }}
    >
      {children}
    </QuestContractContext.Provider>
  );
};

export const useQuestContract = (): ContractContextType<Quest> => {
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
  stateVariable: StateVariables<Quest>;
}) {
  const [data, setData] = useState<Field | null>(null);
  const { loading, getState } = useQuestContract();
  useEffect(() => {
    let continuePolling = watch;

    async function getData() {
      const newData = await getState({
        stateVariable,
      });
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
