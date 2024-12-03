import type { Address } from "@/lib/connect/viem";

import type {
  Block,
  BlockHash,
  BlockIdentifier,
  BlockTag,
  Uncle,
} from "./block";
import type { Hex } from "./misc";
import type { Proof } from "./proof";

export type Index = `0x${string}`;
export type Quantity = `0x${string}`;
export type Status = "0x0" | "0x1";
export type TransactionType =
  | "0x0"
  | "0x1"
  | "0x2"
  | "0x3"
  | "0x4"
  | (string & {});

export type RpcBlock<
  blockTag extends BlockTag = BlockTag,
  includeTransactions extends boolean = boolean,
  transaction = RpcTransaction<blockTag extends "pending" ? true : false>
> = Block<Quantity, includeTransactions, blockTag, transaction>;
export type RpcBlockHash = BlockHash;
export type RpcBlockIdentifier = BlockIdentifier<Quantity>;
export type RpcUncle = Uncle<Quantity>;
export type RpcFeeHistory = any;
export type RpcFeeValues = any;
export type RpcLog = any;
export type RpcProof = Proof<Quantity, Index>;
export type RpcTransactionReceipt = any;
export type RpcTransactionRequest = any;
// `yParity` is optional on the RPC type as some nodes do not return it
// for 1559 & 2930 transactions (they should!).
export type RpcTransaction<pending extends boolean = boolean> = any;

type SuccessResult<result> = {
  method?: undefined;
  result: result;
  error?: undefined;
};
type ErrorResult<error> = {
  method?: undefined;
  result?: undefined;
  error: error;
};
type Subscription<result, error> = {
  method: "mina_subscription";
  error?: undefined;
  result?: undefined;
  params:
    | {
        subscription: string;
        result: result;
        error?: undefined;
      }
    | {
        subscription: string;
        result?: undefined;
        error: error;
      };
};

export type RpcRequest = {
  jsonrpc?: "2.0" | undefined;
  method: string;
  params?: any | undefined;
  id?: number | undefined;
};

export type RpcResponse<result = any, error = any> = {
  jsonrpc: `${number}`;
  id: number;
} & (SuccessResult<result> | ErrorResult<error> | Subscription<result, error>);

/** A key-value mapping of slot and storage values (supposedly 32 bytes each) */
export type RpcStateMapping = {
  [slots: Hex]: Hex;
};

export type RpcAccountStateOverride = {
  /** Fake balance to set for the account before executing the call. <32 bytes */
  balance?: Hex | undefined;
  /** Fake nonce to set for the account before executing the call. <8 bytes */
  nonce?: Hex | undefined;
  /** Fake EVM bytecode to inject into the account before executing the call. */
  code?: Hex | undefined;
  /** Fake key-value mapping to override all slots in the account storage before executing the call. */
  state?: RpcStateMapping | undefined;
  /** Fake key-value mapping to override individual slots in the account storage before executing the call. */
  stateDiff?: RpcStateMapping | undefined;
};

export type RpcStateOverride = {
  [address: Address]: RpcAccountStateOverride;
};
