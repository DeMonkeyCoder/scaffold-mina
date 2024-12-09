import type {Chain} from "@/lib/connect/core/exports/chains";
import {CoreHelperUtil} from "@reown/appkit-core";

// -- Helpers ------------------------------------------------------------------
const RPC_URL = CoreHelperUtil.getBlockchainApiUrl();

// -- Types --------------------------------------------------------------------
interface Options {
    projectId: string;
}

// -- Provider -----------------------------------------------------------------
export function walletConnectProvider({projectId}: Options) {
    return function provider(chain: Chain) {
        // if (!PresetsUtil.WalletConnectRpcChainIds.includes(chain.id)) {
        //   return null;
        // }
        //
        // const baseHttpUrl = `${RPC_URL}/v1/?chainId=${ConstantsUtil.EIP155}:${chain.id}&projectId=${projectId}`;
        //
        // return http(baseHttpUrl);
        throw new Error("not implemented");
    };
}
