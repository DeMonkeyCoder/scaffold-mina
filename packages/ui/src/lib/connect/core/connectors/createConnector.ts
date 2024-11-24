import type {
  AddEthereumChainParameter,
  Address,
  Chain,
  Client,
  ProviderConnectInfo,
  ProviderMessage,
} from "@/lib/connect/viem";

import type { Transport } from "../createConfig";
import type { Emitter } from "../createEmitter";
import type { Storage } from "../createStorage";
import type { Compute, ExactPartial, StrictOmit } from "../types/utils";

export type ConnectorEventMap = {
  change: {
    accounts?: readonly Address[] | undefined;
    chainId?: string | undefined;
  };
  connect: { accounts: readonly Address[]; chainId: string };
  disconnect: never;
  error: { error: Error };
  message: { type: string; data?: unknown | undefined };
};

export type CreateConnectorFn<
  provider = unknown,
  properties extends Record<string, unknown> = Record<string, unknown>,
  storageItem extends Record<string, unknown> = Record<string, unknown>
> = (config: {
  chains: readonly [Chain, ...Chain[]];
  emitter: Emitter<ConnectorEventMap>;
  storage?: Compute<Storage<storageItem>> | null | undefined;
  transports?: Record<number, Transport> | undefined;
}) => Compute<
  {
    readonly icon?: string | undefined;
    readonly id: string;
    readonly name: string;
    readonly supportsSimulation?: boolean | undefined;
    readonly type: string;

    setup?(): Promise<void>;
    connect(
      parameters?:
        | { chainId?: string | undefined; isReconnecting?: boolean | undefined }
        | undefined
    ): Promise<{
      accounts: readonly Address[];
      chainId: string;
    }>;
    disconnect(): Promise<void>;
    getAccounts(): Promise<readonly Address[]>;
    getChainId(): Promise<string>;
    getProvider(
      parameters?: { chainId?: string | undefined } | undefined
    ): Promise<provider>;
    getClient?(
      parameters?: { chainId?: string | undefined } | undefined
    ): Promise<Client>;
    isAuthorized(): Promise<boolean>;
    switchChain?(
      parameters: Compute<{
        addEthereumChainParameter?:
          | ExactPartial<StrictOmit<AddEthereumChainParameter, "chainId">>
          | undefined;
        chainId: string;
      }>
    ): Promise<Chain>;

    onAccountsChanged(accounts: string[]): void;
    onChainChanged(chainId: string): void;
    onConnect?(connectInfo: ProviderConnectInfo): void;
    onDisconnect(error?: Error | undefined): void;
    onMessage?(message: ProviderMessage): void;
  } & properties
>;

export function createConnector<
  provider,
  properties extends Record<string, unknown> = Record<string, unknown>,
  storageItem extends Record<string, unknown> = Record<string, unknown>
>(createConnectorFn: CreateConnectorFn<provider, properties, storageItem>) {
  return createConnectorFn;
}
