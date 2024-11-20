import type { Address } from "@/lib/connect/viem";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { Account } from "../../types/account";
import type { Chain } from "../../types/chain";
import type { PublicZksyncRpcSchema } from "../types/eip1193";

export type GetTestnetPaymasterAddressReturnType = Address | null;

export async function getTestnetPaymasterAddress<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>
): Promise<GetTestnetPaymasterAddressReturnType> {
  const result = await client.request({ method: "zks_getTestnetPaymaster" });
  return result;
}
