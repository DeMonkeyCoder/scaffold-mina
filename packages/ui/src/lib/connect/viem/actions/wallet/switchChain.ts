import type { Account } from "../../accounts/types";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  type NumberToHexErrorType,
  numberToHex,
} from "../../utils/encoding/toHex";

export type SwitchChainParameters = {
  /** ID of Chain to switch to */
  id: Chain["id"];
};

export type SwitchChainErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType;

/**
 * Switch the target chain in a wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/switchChain
 * - JSON-RPC Methods: [`mina_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)
 *
 * @param client - Client to use
 * @param parameters - {@link SwitchChainParameters}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet, optimism } from 'viem/chains'
 * import { switchChain } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * await switchChain(client, { id: optimism.id })
 */
export async function switchChain<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined
>(client: Client<Transport, chain, account>, { id }: SwitchChainParameters) {
  await client.request(
    {
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: numberToHex(id),
        },
      ],
    },
    { retryCount: 0 }
  );
}
