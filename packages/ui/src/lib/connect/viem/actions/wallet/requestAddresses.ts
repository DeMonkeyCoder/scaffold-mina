import type { Address } from "@/lib/connect/viem";

import type { Account } from "../../accounts/types";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import { getAddress } from "../../utils/address/getAddress";
import type { RequestErrorType } from "../../utils/buildRequest";

export type RequestAddressesReturnType = Address[];

export type RequestAddressesErrorType = RequestErrorType | ErrorType;

/**
 * Requests a list of accounts managed by a wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/requestAddresses
 * - JSON-RPC Methods: [`mina_requestAccounts`](https://eips.ethereum.org/EIPS/eip-1102)
 *
 * Sends a request to the wallet, asking for permission to access the user's accounts. After the user accepts the request, it will return a list of accounts (addresses).
 *
 * This API can be useful for dapps that need to access the user's accounts in order to execute transactions or interact with smart contracts.
 *
 * @param client - Client to use
 * @returns List of accounts managed by a wallet {@link RequestAddressesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { requestAddresses } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const accounts = await requestAddresses(client)
 */
export async function requestAddresses<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined
>(
  client: Client<Transport, chain, account>
): Promise<RequestAddressesReturnType> {
  const addresses = await client.request(
    { method: "mina_requestAccounts" },
    { dedupe: true, retryCount: 0 }
  );
  return addresses.map((address) => getAddress(address));
}
