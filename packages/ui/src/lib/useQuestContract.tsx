import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import { fetchAccount, Field, PublicKey } from "o1js";
import { useMinaProvider } from "@/lib/ZkappContext";
import { ContractContextType, Methods, StateVariable } from "@/lib/types";
import { Quest } from "scaffold-mina-contracts";

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
  const { zkappWorkerClient } = useMinaProvider();

  const getState = useCallback(
    async ({ stateVariable }: { stateVariable: StateVariable<Quest> }) => {
      await fetchAccount({
        publicKey: zkappPublicKey,
      });
      return new Quest(zkappPublicKey)[stateVariable].get();
    },
    [zkappPublicKey]
  );

  // TODO: optimize this function by pre-loading the contract or using cloud workers
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
    await zkappWorkerClient.loadAndCompileContract({
      contractName: "Quest",
    });
    await zkappWorkerClient.initZkappInstance({
      contractName: "Quest",
      publicKey: zkappPublicKey,
    });
    await fetchAccount({
      publicKey: zkappPublicKey,
    });
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
