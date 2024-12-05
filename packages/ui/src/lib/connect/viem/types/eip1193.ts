import type { Address } from "@/lib/connect/viem";
import type { Hash, Hex } from "./misc";
import type {
  Quantity,
  RpcTransaction as Transaction,
  RpcTransactionRequest as TransactionRequest,
} from "./rpc";
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

export type TestRpcSchema<mode extends string> = [
  /**
   * @description Add information about compiled contracts
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_addcompilationresult
   */
  {
    Method: `${mode}_addCompilationResult`;
    Parameters: any[];
    ReturnType: any;
  },
  /**
   * @description Remove a transaction from the mempool
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_droptransaction
   */
  {
    Method: `${mode}_dropTransaction`;
    Parameters: [hash: Hash];
    ReturnType: void;
  },
  /**
   * @description Serializes the current state (including contracts code, contract's storage, accounts properties, etc.) into a savable data blob.
   */
  {
    Method: `${mode}_dumpState`;
    Parameters?: undefined;
    ReturnType: Hex;
  },
  /**
   * @description Turn on call traces for transactions that are returned to the user when they execute a transaction (instead of just txhash/receipt).
   */
  {
    Method: `${mode}_enableTraces`;
    Parameters?: undefined;
    ReturnType: void;
  },
  /**
   * @description Impersonate an account or contract address.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_impersonateaccount
   */
  {
    Method: `${mode}_impersonateAccount`;
    Parameters: [address: Address];
    ReturnType: void;
  },
  /**
   * @description Returns true if automatic mining is enabled, and false otherwise. See [Mining Modes](https://hardhat.org/hardhat-network/explanation/mining-modes) to learn more.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_getautomine
   */
  {
    Method: `${mode}_getAutomine`;
    Parameters?: undefined;
    ReturnType: boolean;
  },
  /**
   * @description Adds state previously dumped with `dumpState` to the current chain.
   */
  {
    Method: `${mode}_loadState`;
    Parameters?: [Hex] | undefined;
    ReturnType: void;
  },
  /**
   * @description Advance the block number of the network by a certain number of blocks
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_mine
   */
  {
    Method: `${mode}_mine`;
    Parameters: [
      /** Number of blocks to mine. */
      count: Hex,
      /** Interval between each block in seconds. */
      interval: Hex | undefined
    ];
    ReturnType: void;
  },
  /**
   * @description Resets the fork.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_reset
   */
  {
    Method: `${mode}_reset`;
    Parameters: any[];
    ReturnType: void;
  },
  /**
   * @description Modifies the balance of an account.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setbalance
   */
  {
    Method: `${mode}_setBalance`;
    Parameters: [
      /** The address of the target account. */
      address: Address,
      /** Amount to send in wei. */
      balance: Quantity
    ];
    ReturnType: void;
  },
  /**
   * @description Modifies the bytecode stored at an account's address.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setcode
   */
  {
    Method: `${mode}_setCode`;
    Parameters: [
      /** The address of the contract. */
      address: Address,
      /** Data bytecode. */
      data: string
    ];
    ReturnType: void;
  },
  /**
   * @description Sets the coinbase address to be used in new blocks.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setcoinbase
   */
  {
    Method: `${mode}_setCoinbase`;
    Parameters: [
      /** The address to set as the coinbase address. */
      address: Address
    ];
    ReturnType: void;
  },
  /**
   * @description Enable or disable logging on the test node network.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setcoinbase
   */
  {
    Method: `${mode}_setLoggingEnabled`;
    Parameters: [enabled: boolean];
    ReturnType: void;
  },
  /**
   * @description Change the minimum gas price accepted by the network (in wei).
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setmingasprice
   */
  {
    Method: `${mode}_setMinGasPrice`;
    Parameters: [gasPrice: Quantity];
    ReturnType: void;
  },
  /**
   * @description Sets the base fee of the next block.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setnextblockbasefeepergas
   */
  {
    Method: `${mode}_setNextBlockBaseFeePerGas`;
    Parameters: [baseFeePerGas: Quantity];
    ReturnType: void;
  },
  /**
   * @description Modifies an account's nonce by overwriting it.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setnonce
   */
  {
    Method: `${mode}_setNonce`;
    Parameters: [
      /** The account address. */
      address: Address,
      /** The new nonce. */
      nonce: Quantity
    ];
    ReturnType: void;
  },
  /**
   * @description Sets the backend RPC URL.
   */
  {
    Method: `${mode}_setRpcUrl`;
    Parameters: [url: string];
    ReturnType: void;
  },
  /**
   * @description Writes a single position of an account's storage.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setstorageat
   */
  {
    Method: `${mode}_setStorageAt`;
    Parameters: [
      /** The account address. */
      address: Address,
      /** The storage position index. */
      index: Quantity,
      /** The storage value. */
      value: Quantity
    ];
    ReturnType: void;
  },
  /**
   * @description Use this method to stop impersonating an account after having previously used impersonateAccount.
   * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_stopimpersonatingaccount
   */
  {
    Method: `${mode}_stopImpersonatingAccount`;
    Parameters: [
      /** The address to stop impersonating. */
      address: Address
    ];
    ReturnType: void;
  },
  /**
   * @description Jump forward in time by the given amount of time, in seconds.
   * @link https://github.com/trufflesuite/ganache/blob/ef1858d5d6f27e4baeb75cccd57fb3dc77a45ae8/src/chains/ethereum/ethereum/RPC-METHODS.md#evm_increasetime
   */
  {
    Method: `${mode}_increaseTime`;
    Parameters: [seconds: number];
    ReturnType: Quantity;
  },
  /**
   * @description Modifies the balance of an account.
   * @link https://ganache.dev/#evm_setAccountBalance
   */
  {
    Method: `evm_setAccountBalance`;
    Parameters: [
      /** The address of the target account. */
      address: Address,
      /** Amount to send in wei. */
      value: Quantity
    ];
    ReturnType: void;
  },
  /**
   * @description Enables or disables, based on the single boolean argument, the automatic mining of new blocks with each new transaction submitted to the network.
   * @link https://hardhat.org/hardhat-network/docs/reference#evm_setautomine
   */
  {
    Method: `evm_setAutomine`;
    Parameters: [boolean];
    ReturnType: void;
  },
  /**
   * @description Sets the block's gas limit.
   * @link https://hardhat.org/hardhat-network/docs/reference#evm_setblockgaslimit
   */
  {
    Method: "evm_setBlockGasLimit";
    Parameters: [gasLimit: Quantity];
    ReturnType: void;
  },
  /**
   * @description Jump forward in time by the given amount of time, in seconds.
   * @link https://github.com/trufflesuite/ganache/blob/ef1858d5d6f27e4baeb75cccd57fb3dc77a45ae8/src/chains/ethereum/ethereum/RPC-METHODS.md#evm_increasetime
   */
  {
    Method: `evm_increaseTime`;
    Parameters: [seconds: Quantity];
    ReturnType: Quantity;
  },
  /**
   * @description Similar to `evm_increaseTime` but sets a block timestamp `interval`.
   * The timestamp of the next block will be computed as `lastBlock_timestamp` + `interval`
   */
  {
    Method: `${mode}_setBlockTimestampInterval`;
    Parameters: [seconds: number];
    ReturnType: void;
  },
  /**
   * @description Removes `setBlockTimestampInterval` if it exists
   */
  {
    Method: `${mode}_removeBlockTimestampInterval`;
    Parameters?: undefined;
    ReturnType: void;
  },
  /**
   * @description Enables (with a numeric argument greater than 0) or disables (with a numeric argument equal to 0), the automatic mining of blocks at a regular interval of milliseconds, each of which will include all pending transactions.
   * @link https://hardhat.org/hardhat-network/docs/reference#evm_setintervalmining
   */
  {
    Method: "evm_setIntervalMining";
    Parameters: [number];
    ReturnType: void;
  },
  /**
   * @description Set the timestamp of the next block.
   * @link https://hardhat.org/hardhat-network/docs/reference#evm_setnextblocktimestamp
   */
  {
    Method: "evm_setNextBlockTimestamp";
    Parameters: [Quantity];
    ReturnType: void;
  },
  /**
   * @description Snapshot the state of the blockchain at the current block. Takes no parameters. Returns the id of the snapshot that was created.
   * @link https://hardhat.org/hardhat-network/docs/reference#evm_snapshot
   */
  {
    Method: "evm_snapshot";
    Parameters?: undefined;
    ReturnType: Quantity;
  },
  /**
   * @description Revert the state of the blockchain to a previous snapshot. Takes a single parameter, which is the snapshot id to revert to.
   */
  {
    Method: "evm_revert";
    Parameters?: [id: Quantity] | undefined;
    ReturnType: void;
  },
  /**
   * @description Enables the automatic mining of new blocks with each new transaction submitted to the network.
   * @link https://ganache.dev/#miner_start
   */
  {
    Method: "miner_start";
    Parameters?: undefined;
    ReturnType: void;
  },
  /**
   * @description Disables the automatic mining of new blocks with each new transaction submitted to the network.
   * @link https://ganache.dev/#miner_stop
   */
  {
    Method: "miner_stop";
    Parameters?: undefined;
    ReturnType: void;
  },
  /**
   * @link https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content
   */
  {
    Method: "txpool_content";
    Parameters?: undefined;
    ReturnType: {
      pending: Record<Address, Record<string, Transaction>>;
      queued: Record<Address, Record<string, Transaction>>;
    };
  },
  /**
   * @link https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect
   */
  {
    Method: "txpool_inspect";
    Parameters?: undefined;
    ReturnType: {
      pending: Record<Address, Record<string, string>>;
      queued: Record<Address, Record<string, string>>;
    };
  },
  /**
   * @link https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect
   */
  {
    Method: "txpool_status";
    Parameters?: undefined;
    ReturnType: {
      pending: Quantity;
      queued: Quantity;
    };
  },
  /**
   * @description Returns whether the client is actively mining new blocks.
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_mining' })
   * // => true
   */
  {
    Method: "mina_mining";
    Parameters?: undefined;
    ReturnType: boolean;
  },
  /**
   * @description Advance the block number of the network by a certain number of blocks.
   * @link https://ganache.dev/#evm_mine
   */
  {
    Method: "evm_mine";
    Parameters?:
      | [
          {
            /** Number of blocks to mine. */
            blocks: Hex;
          }
        ]
      | undefined;
    ReturnType: void;
  },
  /**
   * @description Creates, signs, and sends a new transaction to the network regardless of the signature.
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
   * // => '0x...'
   */
  {
    Method: "mina_sendUnsignedTransaction";
    Parameters: [transaction: TransactionRequest];
    ReturnType: Hash;
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
   * @description Creates, signs, and sends a new transaction to the network
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
   * // => '0x...'
   */
  {
    Method: "mina_sendTransaction";
    Parameters: [transaction: TransactionRequest];
    ReturnType: Hash;
  },
  /**
   * @description Sends and already-signed transaction to the network
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_sendRawTransaction', params: ['0x...'] })
   * // => '0x...'
   */
  {
    Method: "mina_sendRawTransaction";
    Parameters: [signedTransaction: Hex];
    ReturnType: Hash;
  },
  /**
   * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_sign', params: ['0x...', '0x...'] })
   * // => '0x...'
   */
  {
    Method: "mina_sign";
    Parameters: [
      /** Address to use for signing */
      address: Address,
      /** Data to sign */
      data: Hex
    ];
    ReturnType: Hex;
  },
  /**
   * @description Signs a transaction that can be submitted to the network at a later time using with `mina_sendRawTransaction`
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
   * // => '0x...'
   */
  {
    Method: "mina_signTransaction";
    Parameters: [request: TransactionRequest];
    ReturnType: Hex;
  },
  /**
   * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] })
   * // => '0x...'
   */
  {
    Method: "mina_signTypedData_v4";
    Parameters: [
      /** Address to use for signing */
      address: Address,
      /** Message to sign containing type information, a domain separator, and data */
      message: string
    ];
    ReturnType: Hex;
  },
  /**
   * @description Returns information about the status of this client’s network synchronization
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'mina_syncing' })
   * // => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' }
   */
  {
    Method: "mina_syncing";
    Parameters?: undefined;
    ReturnType: NetworkSync | false;
  },
  /**
   * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
   * @link https://eips.ethereum.org/EIPS/eip-1474
   * @example
   * provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] })
   * // => '0x...'
   */
  {
    Method: "personal_sign";
    Parameters: [
      /** Data to sign */
      data: Hex,
      /** Address to use for signing */
      address: Address
    ];
    ReturnType: Hex;
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
   * @description Returns the status of a call batch that was sent via `wallet_sendCalls`.
   * @link https://eips.ethereum.org/EIPS/eip-5792
   * @example
   * provider.request({ method: 'wallet_getCallsStatus' })
   * // => { ... }
   */
  {
    Method: "wallet_getCallsStatus";
    Parameters?: [string];
    ReturnType: WalletGetCallsStatusReturnType;
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
   * @description Requests the connected wallet to send a batch of calls.
   * @link https://eips.ethereum.org/EIPS/eip-5792
   * @example
   * provider.request({ method: 'wallet_sendCalls' })
   * // => { ... }
   */
  {
    Method: "wallet_sendCalls";
    Parameters?: WalletSendCallsParameters;
    ReturnType: string;
  },
  /**
   * @description Requests for the wallet to show information about a call batch
   * that was sent via `wallet_sendCalls`.
   * @link https://eips.ethereum.org/EIPS/eip-5792
   * @example
   * provider.request({ method: 'wallet_showCallsStatus', params: ['...'] })
   */
  {
    Method: "wallet_showCallsStatus";
    Parameters?: [string];
    ReturnType: void;
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
  },
  /**
   * @description Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added.
   * @link https://eips.ethereum.org/EIPS/eip-747
   * @example
   * provider.request({ method: 'wallet_watchAsset' }] })
   * // => true
   */
  {
    Method: "wallet_watchAsset";
    Parameters: WatchAssetParams;
    ReturnType: boolean;
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
