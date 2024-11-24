import type { Account } from "../../accounts/types";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";
import { type NumberToHexErrorType } from "../../utils/encoding/toHex";

export type AddChainParameters = {
  /** The chain to add to the wallet. */
  chain: Chain;
};

export type AddChainErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

/**
 * Adds an EVM chain to the wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/addChain
 * - JSON-RPC Methods: [`mina_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)
 *
 * @param client - Client to use
 * @param parameters - {@link AddChainParameters}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { addChain } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   transport: custom(window.ethereum),
 * })
 * await addChain(client, { chain: optimism })
 */
export async function addChain<
  chain extends Chain | undefined,
  account extends Account | undefined
>(client: Client<Transport, chain, account>, { chain }: AddChainParameters) {
  const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain;
  await client.request(
    {
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: id,
          chainName: name,
          nativeCurrency,
          rpcUrls: rpcUrls.default.http,
          blockExplorerUrls: blockExplorers
            ? Object.values(blockExplorers).map(({ url }) => url)
            : undefined,
        },
      ],
    },
    { dedupe: true, retryCount: 0 }
  );
}
