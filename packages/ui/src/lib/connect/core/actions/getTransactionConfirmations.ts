import type { Chain } from "@/lib/connect/viem";
import {
  type GetTransactionConfirmationsErrorType as viem_GetTransactionConfirmationsErrorType,
  type GetTransactionConfirmationsParameters as viem_GetTransactionConfirmationsParameters,
  type GetTransactionConfirmationsReturnType as viem_GetTransactionConfirmationsReturnType,
  getTransactionConfirmations as viem_getTransactionConfirmations,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type { ChainIdParameter } from "../types/properties";
import { getAction } from "../utils/getAction";

export type GetTransactionConfirmationsParameters<
  config extends Config = Config,
  chainId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, chainId>
> = {
  [key in keyof chains]: viem_GetTransactionConfirmationsParameters<
    chains[key]
  > &
    ChainIdParameter<config, chainId>;
}[number];

export type GetTransactionConfirmationsReturnType =
  viem_GetTransactionConfirmationsReturnType;

export type GetTransactionConfirmationsErrorType =
  viem_GetTransactionConfirmationsErrorType;

/** https://wagmi.sh/core/api/actions/getTransactionConfirmations */
export function getTransactionConfirmations<
  config extends Config,
  chainId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"]
>(
  config: config,
  parameters: GetTransactionConfirmationsParameters<config, chainId>
): Promise<GetTransactionConfirmationsReturnType> {
  const { chainId, ...rest } = parameters;
  const client = config.getClient({ chainId });
  const action = getAction(
    client,
    viem_getTransactionConfirmations,
    "getTransactionConfirmations"
  );
  return action(rest as viem_GetTransactionConfirmationsParameters);
}
