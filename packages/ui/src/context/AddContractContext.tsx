import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Field, PublicKey } from "o1js";
import { useZkappContext } from "@/context/ZkappContext";

interface AddContractContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentNum: Field | null;
  setCurrentNum: React.Dispatch<React.SetStateAction<Field | null>>;
  zkappPublicKey: PublicKey;
  creatingTransaction: boolean;
  setCreatingTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  onRefreshCurrentNum: () => void;
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

  const onRefreshCurrentNum = async () => {
    if (zkappWorkerClient && !loading) {
      console.log("Getting zkApp state...");
      await zkappWorkerClient.fetchAccount({
        publicKey: zkappPublicKey,
      });
      const currentNum = await zkappWorkerClient.getNum();
      setCurrentNum(currentNum);
      console.log(`Current state in zkApp: ${currentNum.toString()}`);
    }
  };

  return (
    <AddContractContext.Provider
      value={{
        loading,
        setLoading,
        currentNum,
        setCurrentNum,
        zkappPublicKey,
        creatingTransaction,
        setCreatingTransaction,
        onRefreshCurrentNum,
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
