import type { Address } from "@/lib/connect/viem";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { Account } from "../../types/account";
import type { Chain } from "../../types/chain";
import type { PublicZksyncRpcSchema } from "../types/eip1193";

export type GetBridgehubContractAddressReturnType = Address;

export async function getBridgehubContractAddress<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: Client<Transport, chain, account, PublicZksyncRpcSchema>
): Promise<GetBridgehubContractAddressReturnType> {
  const result = await client.request({ method: "zks_getBridgehubContract" });
  return result;
}
