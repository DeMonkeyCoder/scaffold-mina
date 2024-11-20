import type { Address } from "@/lib/connect/viem";
import type { OneOf } from "../../../types/utils";

/** @internal */
export type AccountSigner = {
  type: "account";
  data: {
    id: Address;
  };
};

/** @internal */
export type KeySigner = {
  type: "key";
  data: {
    id: string;
  };
};

/** @internal */
export type MultiKeySigner = {
  type: "keys";
  data: {
    ids: string[];
  };
};

/** @internal */
export type WalletSigner = {
  type: "wallet";
};

export type Signer = OneOf<
  AccountSigner | KeySigner | MultiKeySigner | WalletSigner
>;
