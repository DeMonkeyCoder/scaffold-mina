import type { BlockTag, Chain } from "@/lib/connect/viem";
import {
  type GetBlockErrorType as viem_GetBlockErrorType,
  type GetBlockParameters as viem_GetBlockParameters,
  type GetBlockReturnType as viem_GetBlockReturnType,
  getBlock as viem_getBlock,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute, IsNarrowable } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetBlockParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest",
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  viem_GetBlockParameters<includeTransactions, blockTag> &
    NetworkIdParameter<config, networkId>
>;

export type GetBlockReturnType<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest",
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = Compute<
  {
    [key in keyof chains]: viem_GetBlockReturnType<
      IsNarrowable<chains[key], Chain> extends true ? chains[key] : undefined,
      includeTransactions,
      blockTag
    > & { networkId: chains[key]["id"] };
  }[number]
>;

export type GetBlockErrorType = viem_GetBlockErrorType;

/** https://wagmi.sh/core/actions/getBlock */
export async function getBlock<
  config extends Config,
  networkId extends config["chains"][number]["id"],
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "latest"
>(
  config: config,
  parameters: GetBlockParameters<
    includeTransactions,
    blockTag,
    config,
    networkId
  > = {}
): Promise<
  GetBlockReturnType<includeTransactions, blockTag, config, networkId>
> {
  const { networkId, ...rest } = parameters;
  const client = config.getClient({ networkId });
  const action = getAction(client, viem_getBlock, "getBlock");
  const block = await action(rest);
  return {
    ...(block as unknown as GetBlockReturnType<
      includeTransactions,
      blockTag,
      config,
      networkId
    >),
    networkId: client.chain.id,
  };
}
