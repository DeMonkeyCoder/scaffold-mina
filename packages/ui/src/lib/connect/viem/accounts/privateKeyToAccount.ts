import { secp256k1 } from "@noble/curves/secp256k1";

import type { Hex } from "../types/misc";
import { toHex, type ToHexErrorType } from "../utils/encoding/toHex";

import type { ErrorType } from "../errors/utils";
import type { NonceManager } from "../utils/nonceManager";
import { toAccount, type ToAccountErrorType } from "./toAccount";
import type { PrivateKeyAccount } from "./types";
import {
  publicKeyToAddress,
  type PublicKeyToAddressErrorType,
} from "./utils/publicKeyToAddress";
import { sign, type SignErrorType } from "./utils/sign";
import { experimental_signAuthorization } from "./utils/signAuthorization";
import { signMessage, type SignMessageErrorType } from "./utils/signMessage";
import {
  signTransaction,
  type SignTransactionErrorType,
} from "./utils/signTransaction";

export type PrivateKeyToAccountOptions = {
  nonceManager?: NonceManager | undefined;
};

export type PrivateKeyToAccountErrorType =
  | ToAccountErrorType
  | ToHexErrorType
  | PublicKeyToAddressErrorType
  | SignErrorType
  | SignMessageErrorType
  | SignTransactionErrorType
  | ErrorType;

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount(
  privateKey: Hex,
  options: PrivateKeyToAccountOptions = {}
): PrivateKeyAccount {
  const { nonceManager } = options;
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const address = publicKeyToAddress(publicKey);

  const account = toAccount({
    address,
    nonceManager,
    async sign({ hash }) {
      return sign({ hash, privateKey, to: "hex" });
    },
    async experimental_signAuthorization(authorization) {
      return experimental_signAuthorization({ ...authorization, privateKey });
    },
    async signMessage({ message }) {
      return signMessage({ message, privateKey });
    },
    async signTransaction(transaction, { serializer } = {}) {
      return signTransaction({ privateKey, transaction, serializer });
    },
  });

  return {
    ...account,
    publicKey,
    source: "privateKey",
  } as PrivateKeyAccount;
}
