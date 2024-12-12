import useDeployedContracts, {ChainContracts} from "@/contracts/useDeployedContracts";
import {useMemo, useState} from "react";
import {useAppKitNetwork} from "@reown/appkit/react";
import {SmartContract} from "o1js";
import {useReadZkAppState} from "@/lib/useReadZkAppState";
import {StateVariable} from "@/lib/types";

function ContractState<T extends SmartContract>({
                                                    contract,
                                                    stateVariable,
                                                }: {
    contract: new (...args: any[]) => T,
    stateVariable: StateVariable<T>
}) {
    const deployedContracts = useDeployedContracts();
    const {chainId: networkId} = useAppKitNetwork()
    const {data} = useReadZkAppState({
        smartContract: contract,
        // @ts-ignore
        publicKey: networkId ? deployedContracts[networkId][contract.name].publicKey : undefined,
        stateVariable,
        watch: true
    })
    return <div className="mb-5 px-7 py-3 bg-purple-50 shadow-lg rounded-full border-stone-400 break-words">
        <div>
            {String(stateVariable)}:
        </div>
        <div>
            {data ? data.toString() : 'Loading...'}
        </div>
    </div>
}

export default function DebugContracts() {
    const {chainId: networkId} = useAppKitNetwork()
    const deployedContracts = useDeployedContracts();
    const chainContracts: ChainContracts = useMemo(() => networkId ? deployedContracts[networkId] : {}, [deployedContracts, networkId]);
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
        <div className="px-5">
            {
                chainContracts && Object.keys(chainContracts).map((contractName) => <button key={contractName}
                                                                                            onClick={() => setSelectedContract(contractName)}
                                                                                            className={`card items-center justify-center whitespace-nowrap text-sm ${selectedContract === contractName ? '!bg-blue-700 !text-white' : ''}`}>{contractName}</button>)
            }
        </div>
        {
            chainContracts && selectedContract && (
                <div className="px-9 py-2">
                    {selectedContractStates.map((stateVariable) => <ContractState
                        key={stateVariable}
                        contract={chainContracts[selectedContract].contract}
                        // @ts-ignore
                        stateVariable={stateVariable}
                    />)}
                </div>
            )
        }
    </div>;
}