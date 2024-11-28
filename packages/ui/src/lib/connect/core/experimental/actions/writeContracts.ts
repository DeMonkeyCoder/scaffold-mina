import type {
  Account,
  Chain,
  ContractFunctionParameters,
} from "@/lib/connect/viem";
import {
  type WriteContractsErrorType as viem_WriteContractsErrorType,
  type WriteContractsParameters as viem_WriteContractsParameters,
  type WriteContractsReturnType as viem_WriteContractsReturnType,
  writeContracts as viem_writeContracts,
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

export type WriteContractsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>
> = {
  [key in keyof chains]: Compute<
    Omit<
      viem_WriteContractsParameters<
        contracts,
        chains[key],
        Account,
        chains[key]
      >,
      "chain"
    > &
      NetworkIdParameter<config, networkId> &
      ConnectorParameter
  >;
}[number];

export type WriteContractsReturnType = viem_WriteContractsReturnType;

export type WriteContractsErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // @/lib/connect/viem
  | viem_WriteContractsErrorType;

/** https://wagmi.sh/core/api/actions/writeContracts */
export async function writeContracts<
  const contracts extends readonly unknown[],
  config extends Config,
  networkId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: WriteContractsParameters<contracts, config, networkId>
): Promise<WriteContractsReturnType> {
  const { account, networkId, connector, ...rest } = parameters;

  const client = await getConnectorClient(config, {
    account,
    networkId,
    connector,
  });

  return viem_writeContracts(client, {
    ...(rest as any),
    ...(account ? { account } : {}),
    chain: networkId ? { id: networkId } : undefined,
  });
}
