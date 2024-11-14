import type {
  AddEthereumChainParameter,
  UserRejectedRequestErrorType,
  SwitchChainErrorType as viem_SwitchChainErrorType,
} from "@/lib/connect/viem";

import type { Config } from "../createConfig";
import type { BaseErrorType, ErrorType } from "../errors/base";
import {
  ChainNotConfiguredError,
  type ChainNotConfiguredErrorType,
} from "../errors/config";
import {
  type ProviderNotFoundErrorType,
  SwitchChainNotSupportedError,
  type SwitchChainNotSupportedErrorType,
} from "../errors/connector";
import type { ConnectorParameter } from "../types/properties";
import type { Compute, ExactPartial } from "../types/utils";

export type SwitchChainParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Compute<
  ConnectorParameter & {
    chainId: chainId | config["chains"][number]["id"];
    addEthereumChainParameter?:
      | Compute<ExactPartial<Omit<AddEthereumChainParameter, "chainId">>>
      | undefined;
  }
>;

export type SwitchChainReturnType<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = Extract<
  config["chains"][number],
  { id: Config extends config ? number : chainId }
>;

export type SwitchChainErrorType =
  | SwitchChainNotSupportedErrorType
  | ChainNotConfiguredErrorType
  // connector.switchChain()
  | ProviderNotFoundErrorType
  | UserRejectedRequestErrorType
  // base
  | BaseErrorType
  | ErrorType
  // @/lib/connect/viem
  | viem_SwitchChainErrorType;

/** https://wagmi.sh/core/api/actions/switchChain */
export async function switchChain<
  config extends Config,
  chainId extends config["chains"][number]["id"]
>(
  config: config,
  parameters: SwitchChainParameters<config, chainId>
): Promise<SwitchChainReturnType<config, chainId>> {
  const { addEthereumChainParameter, chainId } = parameters;

  const connection = config.state.connections.get(
    parameters.connector?.uid ?? config.state.current!
  );
  if (connection) {
    const connector = connection.connector;
    if (!connector.switchChain)
      throw new SwitchChainNotSupportedError({ connector });
    const chain = await connector.switchChain({
      addEthereumChainParameter,
      chainId,
    });
    return chain as SwitchChainReturnType<config, chainId>;
  }

  const chain = config.chains.find((x) => x.id === chainId);
  if (!chain) throw new ChainNotConfiguredError();
  config.setState((x) => ({ ...x, chainId }));
  return chain as SwitchChainReturnType<config, chainId>;
}
