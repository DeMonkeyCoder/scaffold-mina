import type {
  Account,
  Address,
  Chain,
  PrepareTransactionRequestErrorType as viem_PrepareTransactionRequestErrorType,
  PrepareTransactionRequestParameters as viem_PrepareTransactionRequestParameters,
  PrepareTransactionRequestRequest as viem_PrepareTransactionRequestRequest,
  PrepareTransactionRequestReturnType as viem_PrepareTransactionRequestReturnType,
} from "@/lib/connect/viem";
import { prepareTransactionRequest as viem_prepareTransactionRequest } from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type { NetworkIdParameter } from "../types/properties";
import type {
  Compute,
  IsNarrowable,
  UnionCompute,
  UnionStrictOmit,
} from "../types/utils";
import { getAction } from "../utils/getAction";
import { getAccount } from "./getAccount";

export type PrepareTransactionRequestParameters<
  config extends Config = Config,
  networkId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  > = viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >,
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: UnionCompute<
    UnionStrictOmit<
      viem_PrepareTransactionRequestParameters<
        chains[key],
        Account,
        chains[key],
        Account | Address,
        request extends viem_PrepareTransactionRequestRequest<
          chains[key],
          chains[key]
        >
          ? request
          : never
      >,
      "chain"
    > &
      NetworkIdParameter<config, networkId> & {
        to: Address;
      }
  >;
}[number];

export type PrepareTransactionRequestReturnType<
  config extends Config = Config,
  networkId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  > = viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>[0],
    SelectChains<config, networkId>[0]
  >,
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: Compute<
    viem_PrepareTransactionRequestReturnType<
      IsNarrowable<chains[key], Chain> extends true ? chains[key] : undefined,
      Account,
      chains[key],
      Account,
      request extends viem_PrepareTransactionRequestRequest<
        IsNarrowable<chains[key], Chain> extends true ? chains[key] : undefined,
        chains[key]
      >
        ? request
        : never
    >
  > & {
    networkId: chains[key]["id"];
  };
}[number];

export type PrepareTransactionRequestErrorType =
  viem_PrepareTransactionRequestErrorType;

/** https://wagmi.sh/core/api/actions/prepareTransactionRequest */
export async function prepareTransactionRequest<
  config extends Config,
  networkId extends config["chains"][number]["id"] | undefined,
  const request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, networkId>["0"],
    SelectChains<config, networkId>["0"]
  >
>(
  config: config,
  parameters: PrepareTransactionRequestParameters<config, networkId, request>
): Promise<PrepareTransactionRequestReturnType<config, networkId, request>> {
  const { account: account_, networkId, ...rest } = parameters;

  const account = account_ ?? getAccount(config).address;
  const client = config.getClient({ networkId });

  const action = getAction(
    client,
    viem_prepareTransactionRequest,
    "prepareTransactionRequest"
  );
  return action({
    ...rest,
    ...(account ? { account } : {}),
  } as unknown as viem_PrepareTransactionRequestParameters) as unknown as Promise<
    PrepareTransactionRequestReturnType<config, networkId, request>
  >;
}
