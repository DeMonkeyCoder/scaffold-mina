import type { Address } from "@/lib/connect/viem";

import { publicKeyToAddress } from "../../accounts/utils/publicKeyToAddress";
import type { ByteArray, Hex, Signature } from "../../types/misc";

import type { ErrorType } from "../../errors/utils";
import { recoverPublicKey } from "./recoverPublicKey";

export type RecoverAddressParameters = {
  hash: Hex | ByteArray;
  signature: Hex | ByteArray | Signature;
};

export type RecoverAddressReturnType = Address;

export type RecoverAddressErrorType = ErrorType;

export async function recoverAddress({
  hash,
  signature,
}: RecoverAddressParameters): Promise<RecoverAddressReturnType> {
  return publicKeyToAddress(await recoverPublicKey({ hash: hash, signature }));
}
