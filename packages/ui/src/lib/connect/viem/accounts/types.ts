import type { TypedData } from "abitype";
import type { Address } from "@/lib/connect/viem";

import type { SmartAccount } from "../account-abstraction/accounts/types";
import type { Authorization } from "../experimental/eip7702/types/authorization";
import type { HDKey } from "../types/account";
import type { Hash, Hex, SignableMessage } from "../types/misc";
import type {
  TransactionSerializable,
  TransactionSerialized,
} from "../types/transaction";
import type { TypedDataDefinition } from "../types/typedData";
import type { IsNarrowable, OneOf, Prettify } from "../types/utils";
import type { NonceManager } from "../utils/nonceManager";
import type { GetTransactionType } from "../utils/transaction/getTransactionType";
import type { SerializeTransactionFn } from "../utils/transaction/serializeTransaction";
import type { SignAuthorizationReturnType } from "./utils/signAuthorization";

export type Account<address extends Address = Address> = OneOf<
  JsonRpcAccount<address> | LocalAccount<string, address> | SmartAccount
>;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Sources
///////////////////////////////////////////////////////////////////////////////////////////////////

export type AccountSource = Address | CustomSource;
export type CustomSource = {
  address: Address;
  nonceManager?: NonceManager | undefined;
  // TODO(v3): Make `sign` required.
  sign?: ((parameters: { hash: Hash }) => Promise<Hex>) | undefined;
  experimental_signAuthorization?:
    | ((parameters: Authorization) => Promise<SignAuthorizationReturnType>)
    | undefined;
  signMessage: ({ message }: { message: SignableMessage }) => Promise<Hex>;
  signTransaction: <
    serializer extends SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
    transaction extends Parameters<serializer>[0] = Parameters<serializer>[0]
  >(
    transaction: transaction,
    options?:
      | {
          serializer?: serializer | undefined;
        }
      | undefined
  ) => Promise<
    IsNarrowable<
      TransactionSerialized<GetTransactionType<transaction>>,
      Hex
    > extends true
      ? TransactionSerialized<GetTransactionType<transaction>>
      : Hex
  >;
  signTypedData: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData
  >(
    parameters: TypedDataDefinition<typedData, primaryType>
  ) => Promise<Hex>;
};

///////////////////////////////////////////////////////////////////////////////////////////////////
// Accounts
///////////////////////////////////////////////////////////////////////////////////////////////////

export type JsonRpcAccount<address extends Address = Address> = {
  address: address;
  type: "json-rpc";
};

export type LocalAccount<
  source extends string = string,
  address extends Address = Address
> = Prettify<
  CustomSource & {
    address: address;
    publicKey: Hex;
    source: source;
    type: "local";
  }
>;

export type HDAccount = Prettify<
  LocalAccount<"hd"> & {
    getHdKey(): HDKey;
    // TODO(v3): This will be redundant.
    sign: NonNullable<CustomSource["sign"]>;
  }
>;

export type HDOptions =
  | {
      /** The account index to use in the path (`"m/44'/60'/${accountIndex}'/0/0"`). */
      accountIndex?: number | undefined;
      /** The address index to use in the path (`"m/44'/60'/0'/0/${addressIndex}"`). */
      addressIndex?: number | undefined;
      /** The change index to use in the path (`"m/44'/60'/0'/${changeIndex}/0"`). */
      changeIndex?: number | undefined;
      path?: undefined;
    }
  | {
      accountIndex?: undefined;
      addressIndex?: undefined;
      changeIndex?: undefined;
      /** The HD path. */
      path: `m/44'/60'/${string}`;
    };

export type PrivateKeyAccount = Prettify<
  LocalAccount<"privateKey"> & {
    // TODO(v3): This will be redundant.
    sign: NonNullable<CustomSource["sign"]>;
    experimental_signAuthorization: NonNullable<
      CustomSource["experimental_signAuthorization"]
    >;
  }
>;
