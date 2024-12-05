import type { Address } from "@/lib/connect/viem";
import type { Hex } from "./misc";
import type { Quantity } from "./rpc";
import type { OneOf, Prettify } from "./utils";

//////////////////////////////////////////////////
// Provider

export type EIP1474Methods = [...PublicRpcSchema, ...WalletRpcSchema];

export type EIP1193Provider = Prettify<
  EIP1193Events & {
    request: EIP1193RequestFn<EIP1474Methods>;
  }
>;

//////////////////////////////////////////////////
// Errors

export type ProviderRpcErrorType = ProviderRpcError & {
  name: "ProviderRpcError";
};

export class ProviderRpcError extends Error {
  code: number;
  details: string;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.details = message;
  }
}

//////////////////////////////////////////////////
// Provider Events

export type ProviderConnectInfo = {
  networkId: string;
};

export type ProviderMessage = {
  type: string;
  data: unknown;
};

export type EIP1193EventMap = {
  accountsChanged(accounts: Address[]): void;
  chainChanged(networkId: string): void;
  connect(connectInfo: ProviderConnectInfo): void;
  disconnect(error: ProviderRpcError): void;
  message(message: ProviderMessage): void;
};

export type EIP1193Events = {
  on<event extends keyof EIP1193EventMap>(
    event: event,
    listener: EIP1193EventMap[event]
  ): void;
  removeListener<event extends keyof EIP1193EventMap>(
    event: event,
    listener: EIP1193EventMap[event]
  ): void;
};

//////////////////////////////////////////////////
// Provider Requests

export type AddEthereumChainParameter = {
  /** A 0x-prefixed hexadecimal string */
  networkId: string;
  /** The chain name. */
  chainName: string;
  /** Native currency for the chain. */
  nativeCurrency?:
    | {
        name: string;
        symbol: string;
        decimals: number;
      }
    | undefined;
  rpcUrls: readonly string[];
  blockExplorerUrls?: string[] | undefined;
  iconUrls?: string[] | undefined;
};

export type NetworkSync = {
  /** The current block number */
  currentBlock: Quantity;
  /** Number of latest block on the network */
  highestBlock: Quantity;
  /** Block number at which syncing started */
  startingBlock: Quantity;
};

export type WalletCapabilities = {
  [capability: string]: any;
};

export type WalletCapabilitiesRecord<
  capabilities extends WalletCapabilities = WalletCapabilities,
  id extends string | number = Hex
> = {
  [networkId in id]: capabilities;
};

export type WalletCallReceipt<quantity = Hex, status = Hex> = {
  logs: {
    address: Hex;
    data: Hex;
    topics: Hex[];
  }[];
  status: status;
  blockHash: Hex;
  blockNumber: quantity;
  gasUsed: quantity;
  transactionHash: Hex;
};

export type WalletGrantPermissionsParameters = {
  signer?:
    | {
        type: string;
        data?: unknown | undefined;
      }
    | undefined;
  permissions: readonly {
    data: unknown;
    policies: readonly {
      data: unknown;
      type: string;
    }[];
    required?: boolean | undefined;
    type: string;
  }[];
  expiry: number;
};

export type WalletGrantPermissionsReturnType = {
  expiry: number;
  factory?: `0x${string}` | undefined;
  factoryData?: string | undefined;
  grantedPermissions: readonly {
    data: unknown;
    policies: readonly {
      data: unknown;
      type: string;
    }[];
    required?: boolean | undefined;
    type: string;
  }[];
  permissionsContext: string;
  signerData?:
    | {
        userOpBuilder?: `0x${string}` | undefined;
        submitToAddress?: `0x${string}` | undefined;
      }
    | undefined;
};

export type WalletGetCallsStatusReturnType<quantity = Hex, status = Hex> = {
  status: "PENDING" | "CONFIRMED";
  receipts?: WalletCallReceipt<quantity, status>[] | undefined;
};

export type WalletPermissionCaveat = {
  type: string;
  value: any;
};

export type WalletPermission = {
  caveats: WalletPermissionCaveat[];
  date: number;
  id: string;
  invoker: `http://${string}` | `https://${string}`;
  parentCapability: "mina_accounts" | string;
};

export type WalletSendCallsParameters<
  capabilities extends WalletCapabilities = WalletCapabilities,
  networkId extends string = string,
  quantity extends Quantity | bigint = Quantity
> = [
  {
    calls: OneOf<
      | {
          to: Address;
          data?: Hex | undefined;
          value?: quantity | undefined;
        }
      | {
          data: Hex;
        }
    >[];
    capabilities?: capabilities | undefined;
    networkId: networkId;
    from: Address;
    version: string;
  }
];

export type WatchAssetParams = {
  /** Token type. */
  type: "ERC20";
  options: {
    /** The address of the token contract */
    address: string;
    /** A ticker symbol or shorthand, up to 11 characters */
    symbol: string;
    /** The number of token decimals */
    decimals: number;
    /** A string url of the token logo */
    image?: string | undefined;
  };
};

export type PublicRpcSchema = [
  /**
   * @description Returns the number of the most recent block seen by this client
   *
   * @example
   * provider.request({ method: 'mina_blockHash' })
   * // => '0x1b4'
   */
  {
    Method: "mina_blockHash";
    Parameters?: undefined;
    ReturnType: string;
  },
  /**
   * @description Returns the chain ID associated with the current network
   * @example
   * provider.request({ method: 'mina_networkId' })
   * // => '1'
   */
  {
    Method: "mina_networkId";
    Parameters?: undefined;
    ReturnType: string;
  },
  /**
   * @description Returns the balance of an address in wei
   *
   * @example
   * provider.request({ method: 'mina_getBalance', params: ['0x...', 'latest'] })
   * // => '0x12a05...'
   */
  {
    Method: "mina_getBalance";
    Parameters: [
      address: Address
      // block: BlockHash | BlockTag | BlockIdentifier
    ];
    ReturnType: Quantity;
  }
];

export type WalletRpcSchema = [
  /**
   * @description Returns a list of addresses owned by this client
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_accounts' })
   * // => ['0x0fB69...']
   */
  {
    Method: "mina_accounts";
    Parameters?: undefined;
    ReturnType: Address[];
  },
  /**
   * @description Returns the current chain ID associated with the wallet.
   * @example
   * provider.request({ method: 'mina_networkId' })
   * // => '1'
   */
  {
    Method: "mina_networkId";
    Parameters?: undefined;
    ReturnType: string;
  },
  /**
   * @description Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear.
   * @link https://eips.ethereum.org/EIPS/eip-1102
   * @example
   * provider.request({ method: 'mina_requestAccounts' }] })
   * // => ['0x...', '0x...']
   */
  {
    Method: "mina_requestAccounts";
    Parameters?: undefined;
    ReturnType: Address[];
  },
  /**
   * @description Add an Ethereum chain to the wallet.
   * @link https://eips.ethereum.org/EIPS/eip-3085
   * @example
   * provider.request({ method: 'wallet_addEthereumChain', params: [{ networkId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] })
   * // => { ... }
   */
  {
    Method: "wallet_addEthereumChain";
    Parameters: [chain: AddEthereumChainParameter];
    ReturnType: null;
  },
  /**
   * @description Gets the connected wallet's capabilities.
   * @link https://eips.ethereum.org/EIPS/eip-5792
   * @example
   * provider.request({ method: 'wallet_getCapabilities' })
   * // => { ... }
   */
  {
    Method: "wallet_getCapabilities";
    Parameters?: [Address];
    ReturnType: Prettify<WalletCapabilitiesRecord>;
  },
  /**
   * @description Gets the wallets current permissions.
   * @link https://eips.ethereum.org/EIPS/eip-2255
   * @example
   * provider.request({ method: 'wallet_getPermissions' })
   * // => { ... }
   */
  {
    Method: "wallet_getPermissions";
    Parameters?: undefined;
    ReturnType: WalletPermission[];
  },
  /**
   * @description Requests permissions from a wallet
   * @link https://eips.ethereum.org/EIPS/eip-7715
   * @example
   * provider.request({ method: 'wallet_grantPermissions', params: [{ ... }] })
   * // => { ... }
   */
  {
    Method: "wallet_grantPermissions";
    Parameters?: [WalletGrantPermissionsParameters];
    ReturnType: Prettify<WalletGrantPermissionsReturnType>;
  },
  /**
   * @description Requests the given permissions from the user.
   * @link https://eips.ethereum.org/EIPS/eip-2255
   * @example
   * provider.request({ method: 'wallet_requestPermissions', params: [{ mina_accounts: {} }] })
   * // => { ... }
   */
  {
    Method: "wallet_requestPermissions";
    Parameters: [permissions: { mina_accounts: Record<string, any> }];
    ReturnType: WalletPermission[];
  },
  /**
   * @description Revokes the given permissions from the user.
   * @link https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-2.md
   * @example
   * provider.request({ method: 'wallet_revokePermissions', params: [{ mina_accounts: {} }] })
   * // => { ... }
   */
  {
    Method: "wallet_revokePermissions";
    Parameters: [permissions: { mina_accounts: Record<string, any> }];
    ReturnType: null;
  },
  /**
   * @description Switch the wallet to the given Ethereum chain.
   * @link https://eips.ethereum.org/EIPS/eip-3326
   * @example
   * provider.request({ method: 'mina_switchChain', params: [{ networkId: '0xf00' }] })
   * // => { ... }
   */
  {
    Method: "mina_switchChain";
    Parameters: [networkId: string];
    ReturnType: null;
  }
];

///////////////////////////////////////////////////////////////////////////
// Utils

export type RpcSchema = readonly {
  Method: string;
  Parameters?: unknown | undefined;
  ReturnType: unknown;
}[];

export type RpcSchemaOverride = Omit<RpcSchema[number], "Method">;

export type EIP1193Parameters<
  rpcSchema extends RpcSchema | undefined = undefined
> = rpcSchema extends RpcSchema
  ? {
      [K in keyof rpcSchema]: Prettify<
        {
          method: rpcSchema[K] extends rpcSchema[number]
            ? rpcSchema[K]["Method"]
            : never;
        } & (rpcSchema[K] extends rpcSchema[number]
          ? rpcSchema[K]["Parameters"] extends undefined
            ? { params?: undefined }
            : { params: rpcSchema[K]["Parameters"] }
          : never)
      >;
    }[number]
  : {
      method: string;
      params?: unknown | undefined;
    };

export type EIP1193RequestOptions = {
  // Deduplicate in-flight requests.
  dedupe?: boolean | undefined;
  // The base delay (in ms) between retries.
  retryDelay?: number | undefined;
  // The max number of times to retry.
  retryCount?: number | undefined;
  /** Unique identifier for the request. */
  uid?: string | undefined;
};

type DerivedRpcSchema<
  rpcSchema extends RpcSchema | undefined,
  rpcSchemaOverride extends RpcSchemaOverride | undefined
> = rpcSchemaOverride extends RpcSchemaOverride
  ? [rpcSchemaOverride & { Method: string }]
  : rpcSchema;

export type EIP1193RequestFn<
  rpcSchema extends RpcSchema | undefined = undefined
> = <
  rpcSchemaOverride extends RpcSchemaOverride | undefined = undefined,
  _parameters extends EIP1193Parameters<
    DerivedRpcSchema<rpcSchema, rpcSchemaOverride>
  > = EIP1193Parameters<DerivedRpcSchema<rpcSchema, rpcSchemaOverride>>,
  _returnType = DerivedRpcSchema<rpcSchema, rpcSchemaOverride> extends RpcSchema
    ? Extract<
        DerivedRpcSchema<rpcSchema, rpcSchemaOverride>[number],
        { Method: _parameters["method"] }
      >["ReturnType"]
    : unknown
>(
  args: _parameters,
  options?: EIP1193RequestOptions | undefined
) => Promise<_returnType>;
