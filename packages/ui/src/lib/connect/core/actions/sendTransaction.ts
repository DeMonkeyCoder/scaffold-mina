import type {
  Account,
  Chain,
  Client,
  TransactionRequest,
  SendTransactionErrorType as viem_SendTransactionErrorType,
  SendTransactionParameters as viem_SendTransactionParameters,
  SendTransactionReturnType as viem_SendTransactionReturnType,
} from "@/lib/connect/viem";
import {
  estimateGas as viem_estimateGas,
  sendTransaction as viem_sendTransaction,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { BaseErrorType, ErrorType } from "../errors/base";
import type { SelectChains } from "../types/chain";
import type {
  NetworkIdParameter,
  ConnectorParameter,
} from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";
import { getAccount } from "./getAccount";
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from "./getConnectorClient";

export type SendTransactionParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: Compute<
    Omit<
      viem_SendTransactionParameters<chains[key], Account, chains[key]>,
      "chain" | "gas"
    > &
      NetworkIdParameter<config, networkId> &
      ConnectorParameter
  >;
}[number] & {
  /** Gas provided for transaction execution, or `null` to skip the prelude gas estimation. */
  gas?: TransactionRequest["gas"] | null;
};

export type SendTransactionReturnType = viem_SendTransactionReturnType;

export type SendTransactionErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // @/lib/connect/viem
  | viem_SendTransactionErrorType;

/** https://wagmi.sh/core/api/actions/sendTransaction */
export async function sendTransaction<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: SendTransactionParameters<config, networkId>
): Promise<SendTransactionReturnType> {
  const { account, networkId, connector, gas: gas_, ...rest } = parameters;

  let client: Client;
  if (typeof account === "object" && account.type === "local")
    client = config.getClient({ networkId });
  else
    client = await getConnectorClient(config, {
      account,
      networkId,
      connector,
    });

  const { connector: activeConnector } = getAccount(config);

  const gas = await (async () => {
    // Skip gas estimation if `data` doesn't exist (not a contract interaction).
    if (!("data" in parameters) || !parameters.data) return undefined;

    // Skip gas estimation if connector supports simulation.
    if ((connector ?? activeConnector)?.supportsSimulation) return undefined;

    // Skip gas estimation if `null` is provided.
    if (gas_ === null) return undefined;

    // Run gas estimation if no value is provided.
    if (gas_ === undefined) {
      const action = getAction(client, viem_estimateGas, "estimateGas");
      return action({
        ...(rest as any),
        account,
        chain: networkId ? { id: networkId } : null,
      });
    }

    // Use provided gas value.
    return gas_;
  })();

  const action = getAction(client, viem_sendTransaction, "sendTransaction");
  const hash = await action({
    ...(rest as any),
    ...(account ? { account } : {}),
    gas,
    chain: networkId ? { id: networkId } : null,
  });

  return hash;
}
