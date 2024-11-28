import type { Chain } from "@/lib/connect/viem";
import {
  type GetTransactionReceiptErrorType as viem_GetTransactionReceiptErrorType,
  type GetTransactionReceiptParameters as viem_GetTransactionReceiptParameters,
  type GetTransactionReceiptReturnType as viem_GetTransactionReceiptReturnType,
  getTransactionReceipt as viem_getTransactionReceipt,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute, IsNarrowable } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetTransactionReceiptParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  viem_GetTransactionReceiptParameters & NetworkIdParameter<config, networkId>
>;

export type GetTransactionReceiptReturnType<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = Compute<
  {
    [key in keyof chains]: viem_GetTransactionReceiptReturnType<
      IsNarrowable<chains[key], Chain> extends true ? chains[key] : undefined
    > & { networkId: chains[key]["id"] };
  }[number]
>;

export type GetTransactionReceiptErrorType =
  viem_GetTransactionReceiptErrorType;

/** https://wagmi.sh/core/api/actions/getTransactionReceipt */
export async function getTransactionReceipt<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: GetTransactionReceiptParameters<config>
): Promise<GetTransactionReceiptReturnType<config, networkId>> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(
    client,
    viem_getTransactionReceipt,
    "getTransactionReceipt"
  );
  return action(rest) as unknown as Promise<
    GetTransactionReceiptReturnType<config, networkId>
  >;
}
