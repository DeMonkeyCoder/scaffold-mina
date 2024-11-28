import type { Chain } from "@/lib/connect/viem";
import { hexToString } from "@/lib/connect/viem";
import {
  call,
  getTransaction,
  type WaitForTransactionReceiptErrorType as viem_WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptParameters as viem_WaitForTransactionReceiptParameters,
  type WaitForTransactionReceiptReturnType as viem_WaitForTransactionReceiptReturnType,
  waitForTransactionReceipt as viem_waitForTransactionReceipt,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { SelectChains } from "../types/chain";
import type { NetworkIdParameter } from "../types/properties";
import type { Compute, IsNarrowable } from "../types/utils";
import { getAction } from "../utils/getAction";

export type WaitForTransactionReceiptParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  viem_WaitForTransactionReceiptParameters &
    NetworkIdParameter<config, networkId>
>;

export type WaitForTransactionReceiptReturnType<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = Compute<
  {
    [key in keyof chains]: viem_WaitForTransactionReceiptReturnType<
      IsNarrowable<chains[key], Chain> extends true ? chains[key] : undefined
    > & { networkId: chains[key]["id"] };
  }[number]
>;

export type WaitForTransactionReceiptErrorType =
  viem_WaitForTransactionReceiptErrorType;

export async function waitForTransactionReceipt<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: WaitForTransactionReceiptParameters<config, networkId>
): Promise<WaitForTransactionReceiptReturnType<config, networkId>> {
  const { networkId, timeout = 0, ...rest } = parameters;

  const client = config.getClient({ networkId });
  const action = getAction(
    client,
    viem_waitForTransactionReceipt,
    "waitForTransactionReceipt"
  );
  const receipt = await action({ ...rest, timeout });

  if (receipt.status === "reverted") {
    const action_getTransaction = getAction(
      client,
      getTransaction,
      "getTransaction"
    );
    const txn = await action_getTransaction({ hash: receipt.transactionHash });
    const action_call = getAction(client, call, "call");
    const code = await action_call({
      ...(txn as any),
      gasPrice: txn.type !== "eip1559" ? txn.gasPrice : undefined,
      maxFeePerGas: txn.type === "eip1559" ? txn.maxFeePerGas : undefined,
      maxPriorityFeePerGas:
        txn.type === "eip1559" ? txn.maxPriorityFeePerGas : undefined,
    });
    const reason = code?.data
      ? hexToString(`0x${code.data.substring(138)}`)
      : "unknown reason";
    throw new Error(reason);
  }

  return {
    ...receipt,
    networkId: client.chain.id,
  } as WaitForTransactionReceiptReturnType<config, networkId>;
}
