// TODO(v3): Rename to `toLocalAccount` + add `source` property to define source (privateKey, mnemonic, hdKey, etc).

import type { Address } from "@/lib/connect/viem";

import {
  InvalidAddressError,
  type InvalidAddressErrorType,
} from "../errors/address";
import { isAddress, type IsAddressErrorType } from "../utils/address/isAddress";

import type { ErrorType } from "../errors/utils";
import type {
  AccountSource,
  CustomSource,
  JsonRpcAccount,
  LocalAccount,
} from "./types";

type GetAccountReturnType<accountSource extends AccountSource> =
  | (accountSource extends Address ? JsonRpcAccount : never)
  | (accountSource extends CustomSource ? LocalAccount : never);

export type ToAccountErrorType =
  | InvalidAddressErrorType
  | IsAddressErrorType
  | ErrorType;

/**
 * @description Creates an Account from a custom signing implementation.
 *
 * @returns A Local Account.
 */
export function toAccount<accountSource extends AccountSource>(
  source: accountSource
): GetAccountReturnType<accountSource> {
  if (typeof source === "string") {
    if (!isAddress(source, { strict: false }))
      throw new InvalidAddressError({ address: source });
    return {
      address: source,
      type: "json-rpc",
    } as GetAccountReturnType<accountSource>;
  }

  if (!isAddress(source.address, { strict: false }))
    throw new InvalidAddressError({ address: source.address });
  return {
    address: source.address,
    nonceManager: source.nonceManager,
    source: "custom",
    type: "local",
  } as GetAccountReturnType<accountSource>;
}
