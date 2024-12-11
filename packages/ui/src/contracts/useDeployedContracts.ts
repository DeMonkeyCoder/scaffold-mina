import {minaDevnet} from "@/lib/connect/appkit/networks";
import {Add, Quest} from "scaffold-mina-contracts";
import {useMemo} from "react";
import {PublicKey, SmartContract} from "o1js";
import {CaipNetwork} from "@reown/appkit-common";

export type ChainContracts = {
    [key: string]: {
        contract: new (...args: any[]) => SmartContract,
        publicKey: PublicKey,
    }
}

export type Contracts = {
    [chainId: CaipNetwork['id']]: ChainContracts
}

const useDeployedContracts = () => {
    return useMemo(() => ({
        [minaDevnet.id]: {
            Quest: {
                contract: Quest,
                publicKey: PublicKey.fromBase58(
                    "B62qjDnppFhY5tsEmLbCDRniCoJcYqLmHpEeXVfwM4Ej18uJFhTrmBb"
                )
            },
            Add: {
                contract: Add,
                publicKey: PublicKey.fromBase58(
                    "B62qjDnppFhY5tsEmLbCDRniCoJcYqLmHpEeXVfwM4Ej18uJFhTrmBb"
                )
            }
        }
    } satisfies Contracts), [])
}

export default useDeployedContracts satisfies () => Contracts;