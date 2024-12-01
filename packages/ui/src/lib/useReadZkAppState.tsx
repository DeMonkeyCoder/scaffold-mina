import { useBlockHash } from "@/lib/connect/react/hooks/useBlockHash";
import { useEffect, useState } from "react";
import { fetchAccount, Field, PublicKey, SmartContract, State } from "o1js";
import { StateVariable } from "@/lib/types";

// Helper type to assert that a property is a State
type IsStateField<T> = T extends State<any> ? T : never;

export function useReadZkAppState<T extends SmartContract>({
  smartContract,
  watch,
  stateVariable,
  publicKey,
}: {
  smartContract: new (...args: any[]) => T;
  watch?: boolean;
  stateVariable: StateVariable<T>;
  publicKey: PublicKey;
}) {
  const { data: blockHash } = useBlockHash({ watch });
  const [data, setData] = useState<Field | null>(null);
  useEffect(() => {
    async function getData() {
      await fetchAccount({
        publicKey,
      });
      const zkAppInstance = new smartContract(publicKey);
      const stateVariableInstance = zkAppInstance[stateVariable];
      setData(
        (
          stateVariableInstance as IsStateField<typeof stateVariableInstance>
        ).get()
      );
    }

    getData();
  }, [stateVariable, blockHash, publicKey, smartContract]);
  return {
    data,
  };
}
