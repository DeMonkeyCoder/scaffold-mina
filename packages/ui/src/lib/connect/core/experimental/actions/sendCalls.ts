import type { Account, Chain } from "@/lib/connect/viem";
import {
  type SendCallsErrorType as viem_SendCallsErrorType,
  type SendCallsParameters as viem_SendCallsParameters,
  type SendCallsReturnType as viem_SendCallsReturnType,
  sendCalls as viem_sendCalls,
} from "@/lib/connect/viem/experimental";

import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from "../../actions/getConnectorClient";
import type { Config } from "../../createConfig";
import type { BaseErrorType, ErrorType } from "../../errors/base";
import type { SelectChains } from "../../types/chain";
import type {
  NetworkIdParameter,
  ConnectorParameter,
} from "../../types/properties";
import type { Compute } from "../../types/utils";

export type SendCallsParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: Compute<
    Omit<viem_SendCallsParameters<chains[key], Account, chains[key]>, "chain"> &
      NetworkIdParameter<config, networkId> &
      ConnectorParameter
  >;
}[number];

export type SendCallsReturnType = viem_SendCallsReturnType;

export type SendCallsErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // @/lib/connect/viem
  | viem_SendCallsErrorType;

/** https://wagmi.sh/core/api/actions/sendCalls */
export async function sendCalls<
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: SendCallsParameters<config, networkId>
): Promise<SendCallsReturnType> {
  const { account, networkId, connector, calls, ...rest } = parameters;

  const client = await getConnectorClient(config, {
    account,
    networkId,
    connector,
  });

  return viem_sendCalls(client, {
    ...(rest as any),
    ...(account ? { account } : {}),
    calls,
    chain: networkId ? { id: networkId } : undefined,
  });
}
