import type { Address } from "@/lib/connect/viem";

import {
  InvalidAddressError,
  type InvalidAddressErrorType,
} from "../../errors/address";
import type { ErrorType } from "../../errors/utils";
import { isAddress } from "./isAddress";

export type IsAddressEqualReturnType = boolean;
export type IsAddressEqualErrorType = InvalidAddressErrorType | ErrorType;

export function isAddressEqual(a: Address, b: Address) {
  if (!isAddress(a, { strict: false }))
    throw new InvalidAddressError({ address: a });
  if (!isAddress(b, { strict: false }))
    throw new InvalidAddressError({ address: b });
  return a.toLowerCase() === b.toLowerCase();
}
