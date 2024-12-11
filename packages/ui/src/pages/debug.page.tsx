import useDeployedContracts, {ChainContracts} from "@/contracts/useDeployedContracts";
import {useMemo, useState} from "react";
import {useAppKitNetwork} from "@reown/appkit/react";
import {SmartContract, State} from "o1js";

function getStateVariableNames<T extends new (...args: any[]) => SmartContract>(contractClass: T): string[] {
    if (!(contractClass.prototype instanceof SmartContract)) {
        throw new Error("Provided class is not a SmartContract.");
    }

    const stateVariables: string[] = [];

    // Reflect over the prototype to find state variables
    for (const key of Object.keys(contractClass.prototype)) {
        const property = (contractClass.prototype as any)[key];
        if (property && property instanceof State) {
            stateVariables.push(key);
        }
    }

    return stateVariables;
}

function ContractState({
                           contract,
                           stateVariable,
                       }: {
    contract: any,
    stateVariable: any
}) {
    return <div></div>
}

export default function DebugContracts() {
    const {chainId: networkId} = useAppKitNetwork()
    const deployedContracts = useDeployedContracts();
    const chainContracts: ChainContracts = useMemo(() => networkId ? deployedContracts[networkId] : {}, [deployedContracts, networkId]);
    console.log({
        networkId,
        chainContracts
    })
    const [selectedContract, setSelectedContract] = useState<keyof typeof chainContracts | undefined>(chainContracts ? Object.keys(chainContracts)[0] : undefined);
    const selectedContractStates = useMemo(() => {
        if (selectedContract && chainContracts) {
            // @ts-ignore
            const notStateVariables = ["constructor", "init", ...chainContracts[selectedContract].contract["_methods"].map(m => m.methodName)]
            return Object.getOwnPropertyNames(chainContracts[selectedContract].contract.prototype).filter(n => !notStateVariables.includes(n))
        }
        return [];
    }, [chainContracts, selectedContract]);
    return <div className="mt-20">
        {
            chainContracts && Object.keys(chainContracts).map((contractName) => <button key={contractName}
                                                                                        onClick={() => setSelectedContract(contractName)}
                                                                                        className={`m-1 p-1 ${selectedContract === contractName ? 'bg-blue-700' : 'bg-white'}`}>{contractName}</button>)
        }
        {
            chainContracts && selectedContract && (
                <div>
                    {String(selectedContractStates)}
                </div>
            )
        }
    </div>;
}