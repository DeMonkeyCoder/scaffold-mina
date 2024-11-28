import type { ErrorType } from "../../errors/utils";
import type { Hex } from "../../types/misc";
import type {
  TransactionSerializable,
  TransactionSerialized,
} from "../../types/transaction";
import { keccak256, type Keccak256ErrorType } from "../../utils/hash/keccak256";
import type { GetTransactionType } from "../../utils/transaction/getTransactionType";
import {
  serializeTransaction,
  type SerializeTransactionFn,
} from "../../utils/transaction/serializeTransaction";

import { sign, type SignErrorType } from "./sign";

export type SignTransactionParameters<
  serializer extends SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
  transaction extends Parameters<serializer>[0] = Parameters<serializer>[0]
> = {
  privateKey: Hex;
  transaction: transaction;
  serializer?: serializer | undefined;
};

export type SignTransactionReturnType<
  serializer extends SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
  transaction extends Parameters<serializer>[0] = Parameters<serializer>[0]
> = TransactionSerialized<GetTransactionType<transaction>>;

export type SignTransactionErrorType =
  | Keccak256ErrorType
  | SignErrorType
  | ErrorType;

export async function signTransaction<
  serializer extends SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
  transaction extends Parameters<serializer>[0] = Parameters<serializer>[0]
>(
  parameters: SignTransactionParameters<serializer, transaction>
): Promise<SignTransactionReturnType<serializer, transaction>> {
  const {
    privateKey,
    transaction,
    serializer = serializeTransaction,
  } = parameters;

  const signableTransaction = (() => {
    // For EIP-4844 Transactions, we want to sign the transaction payload body (tx_payload_body) without the sidecars (ie. without the network wrapper).
    // See: https://github.com/ethereum/EIPs/blob/e00f4daa66bd56e2dbd5f1d36d09fd613811a48b/EIPS/eip-4844.md#networking
    if (transaction.type === "eip4844")
      return {
        ...transaction,
        sidecars: false,
      };
    return transaction;
  })();

  const signature = await sign({
    hash: keccak256(serializer(signableTransaction)),
    privateKey,
  });
  return serializer(transaction, signature) as SignTransactionReturnType<
    serializer,
    transaction
  >;
}
