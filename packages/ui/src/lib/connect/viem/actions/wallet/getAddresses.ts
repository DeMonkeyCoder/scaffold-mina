import type { Address } from "@/lib/connect/viem";

import type { Account } from "../../accounts/types";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import {
  checksumAddress,
  type ChecksumAddressErrorType,
} from "../../utils/address/getAddress";
import type { RequestErrorType } from "../../utils/buildRequest";

export type GetAddressesReturnType = Address[];

export type GetAddressesErrorType =
  | RequestErrorType
  | ChecksumAddressErrorType
  | ErrorType;

/**
 * Returns a list of account addresses owned by the wallet or client.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/getAddresses
 * - JSON-RPC Methods: [`mina_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_accounts)
 *
 * @param client - Client to use
 * @returns List of account addresses owned by the wallet or client. {@link GetAddressesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getAddresses } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const accounts = await getAddresses(client)
 */
export async function getAddresses<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined
>(client: Client<Transport, chain, account>): Promise<GetAddressesReturnType> {
  if (client.account?.type === "local") return [client.account.address];
  const addresses = await client.request(
    { method: "mina_accounts" },
    { dedupe: true }
  );
  return addresses.map((address) => checksumAddress(address));
}
