import type { ErrorType } from "../../errors/utils";
import type {
  Authorization,
  SignedAuthorization,
} from "../../experimental/eip7702/types/authorization";
import {
  type HashAuthorizationErrorType,
  hashAuthorization,
} from "../../experimental/eip7702/utils/hashAuthorization";
import type { Hex, Signature } from "../../types/misc";
import type { Prettify } from "../../types/utils";
import {
  type SignErrorType,
  type SignParameters,
  type SignReturnType,
  sign,
} from "./sign";

type To = "object" | "bytes" | "hex";

export type SignAuthorizationParameters<to extends To = "object"> =
  Authorization & {
    /** The private key to sign with. */
    privateKey: Hex;
    to?: SignParameters<to>["to"] | undefined;
  };

export type SignAuthorizationReturnType<to extends To = "object"> = Prettify<
  to extends "object" ? SignedAuthorization : SignReturnType<to>
>;

export type SignAuthorizationErrorType =
  | SignErrorType
  | HashAuthorizationErrorType
  | ErrorType;

/**
 * Signs an Authorization hash in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
 */
export async function experimental_signAuthorization<to extends To = "object">(
  parameters: SignAuthorizationParameters<to>
): Promise<SignAuthorizationReturnType<to>> {
  const {
    contractAddress,
    networkId,
    nonce,
    privateKey,
    to = "object",
  } = parameters;
  const signature = await sign({
    hash: hashAuthorization({ contractAddress, networkId, nonce }),
    privateKey,
    to,
  });
  if (to === "object")
    return {
      contractAddress,
      networkId,
      nonce,
      ...(signature as Signature),
    } as any;
  return signature as any;
}
