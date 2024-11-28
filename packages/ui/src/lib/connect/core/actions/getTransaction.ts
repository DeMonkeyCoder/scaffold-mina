import type { Chain } from "@/lib/connect/viem";
import {
  type GetTransactionErrorType as viem_GetTransactionErrorType,
  type GetTransactionParameters as viem_GetTransactionParameters,
  type GetTransactionReturnType as viem_GetTransactionReturnType,
  getTransaction as viem_getTransaction,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute, IsNarrowable } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetTransactionParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  viem_GetTransactionParameters & NetworkIdParameter<config, networkId>
>;

export type GetTransactionReturnType<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = Compute<
  {
    [key in keyof chains]: viem_GetTransactionReturnType<
      IsNarrowable<chains[key], Chain> extends true ? chains[key] : undefined
    > & { networkId: chains[key]["id"] };
  }[number]
>;

export type GetTransactionErrorType = viem_GetTransactionErrorType;

/** https://wagmi.sh/core/api/actions/getTransaction */
export function getTransaction<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: GetTransactionParameters<config, networkId>
): Promise<GetTransactionReturnType<config, networkId>> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_getTransaction, "getTransaction");
  return action(rest) as unknown as Promise<
    GetTransactionReturnType<config, networkId>
  >;
}
