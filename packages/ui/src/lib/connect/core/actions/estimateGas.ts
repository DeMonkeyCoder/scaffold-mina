import type { Account, Address, Chain } from "@/lib/connect/viem";
import {
  type EstimateGasErrorType as viem_EstimateGasErrorType,
  type EstimateGasParameters as viem_EstimateGasParameters,
  type EstimateGasReturnType as viem_EstimateGasReturnType,
  estimateGas as viem_estimateGas,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { BaseErrorType, ErrorType } from "../errors/base";
import type { SelectChains } from "../types/chain";
import type {
  ChainIdParameter,
  ConnectorParameter,
} from "../types/properties";
import type { UnionCompute, UnionLooseOmit } from "../types/utils";
import { getAction } from "../utils/getAction";
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from "./getConnectorClient";

export type EstimateGasParameters<
  config extends Config = Config,
  chainId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, chainId>
> = {
  [key in keyof chains]: UnionCompute<
    UnionLooseOmit<viem_EstimateGasParameters<chains[key]>, "chain"> &
      ChainIdParameter<config, chainId> &
      ConnectorParameter
  >;
}[number];

export type EstimateGasReturnType = viem_EstimateGasReturnType;

export type EstimateGasErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // @/lib/connect/viem
  | viem_EstimateGasErrorType;

/** https://wagmi.sh/core/api/actions/estimateGas */
export async function estimateGas<
  config extends Config,
  chainId extends config["chains"][number]["id"] | undefined = undefined
>(
  config: config,
  parameters: EstimateGasParameters<config, chainId>
): Promise<EstimateGasReturnType> {
  const { chainId, connector, ...rest } = parameters;

  let account: Address | Account;
  if (parameters.account) account = parameters.account;
  else {
    const connectorClient = await getConnectorClient(config, {
      account: parameters.account,
      chainId,
      connector,
    });
    account = connectorClient.account;
  }

  const client = config.getClient({ chainId });
  const action = getAction(client, viem_estimateGas, "estimateGas");
  return action({ ...(rest as viem_EstimateGasParameters), account });
}
