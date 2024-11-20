import type { Address } from "@/lib/connect/viem";
import { parseAccount } from "../../accounts/utils/parseAccount";
import { readContract } from "../../actions/public/readContract";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import { erc20Abi } from "../../constants/abis";
import type { AccountNotFoundError } from "../../errors/account";
import type { BaseError } from "../../errors/base";
import type { Account, GetAccountParameter } from "../../types/account";
import type { BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";

export type GetL1AllowanceParameters<
  account extends Account | undefined = Account | undefined
> = GetAccountParameter<account> & {
  bridgeAddress: Address;
  blockTag?: BlockTag;
  token: Address;
};

export type GetL1AllowanceReturnType = bigint;

export type GetL1AllowanceErrorType = AccountNotFoundError | BaseError;

export async function getL1Allowance<
  chain extends Chain | undefined,
  account extends Account | undefined
>(
  client: Client<Transport, chain, account>,
  parameters: GetL1AllowanceParameters<account>
): Promise<GetL1AllowanceReturnType> {
  const { token, bridgeAddress, blockTag, account: account_ } = parameters;

  const account = account_ ? parseAccount(account_) : client.account;

  return await readContract(client, {
    abi: erc20Abi,
    address: token,
    functionName: "allowance",
    args: [account!.address, bridgeAddress],
    blockTag: blockTag,
  });
}
