import type { Address } from "@/lib/connect/viem";
import type { Hex, Signature } from "../../../types/misc";

export type RpcAuthorization = {
  /** Address of the contract to set as code for the Authority. */
  address: Address;
  /** Chain ID to authorize. */
  chainId: string;
  /** Nonce of the Authority to authorize. */
  nonce: Hex;
} & Signature;
export type RpcAuthorizationList = readonly RpcAuthorization[];
