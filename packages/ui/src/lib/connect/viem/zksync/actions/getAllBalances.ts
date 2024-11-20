import type { Address } from "@/lib/connect/viem";
import { parseAccount } from "../../accounts/utils/parseAccount";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { Account, GetAccountParameter } from "../../types/account";
import type { Chain } from "../../types/chain";
import { hexToBigInt } from "../../utils/encoding/fromHex";
import type { PublicZksyncRpcSchema } from "../types/eip1193";

export type GetAllBalancesParameters<
  account extends Account | undefined = Account | undefined
> = GetAccountParameter<account>;

export type GetAllBalancesReturnType = { [key: Address]: bigint };

export async function getAllBalances<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>,
  parameters: GetAllBalancesParameters<account>
): Promise<GetAllBalancesReturnType> {
  const { account: account_ } = parameters;
  const account = account_ ? parseAccount(account_) : client.account;
  const balances = await client.request({
    method: "zks_getAllAccountBalances",
    params: [account!.address],
  });
  const convertedBalances: GetAllBalancesReturnType = {};
  for (const token in balances)
    (convertedBalances as any)[token] = hexToBigInt((balances as any)[token]);
  return convertedBalances;
}
