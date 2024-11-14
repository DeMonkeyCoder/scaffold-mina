import type { Address, Narrow } from "abitype";
import {
  type ParseAccountErrorType,
  parseAccount,
} from "../../../accounts/utils/parseAccount";
import type { Client } from "../../../clients/createClient";
import type { Transport } from "../../../clients/transports/createTransport";
import { AccountNotFoundError } from "../../../errors/account";
import type { BaseError } from "../../../errors/base";
import type { ErrorType } from "../../../errors/utils";
import type { Chain } from "../../../types/chain";
import type { Hex } from "../../../types/misc";
import type { Assign, OneOf, Prettify } from "../../../types/utils";
import type { RequestErrorType } from "../../../utils/buildRequest";
import { getAction } from "../../../utils/getAction";
import type { SmartAccount } from "../../accounts/types";
import type { PaymasterActions } from "../../clients/decorators/paymaster";
import type {
  DeriveSmartAccount,
  GetSmartAccountParameter,
} from "../../types/account";
import type {
  DeriveEntryPointVersion,
  EntryPointVersion,
} from "../../types/entryPointVersion";
import type {
  EstimateUserOperationGasReturnType as EstimateUserOperationGasReturnType_,
  UserOperation,
  UserOperationCalls,
  UserOperationRequest,
} from "../../types/userOperation";
import { getUserOperationError } from "../../utils/errors/getUserOperationError";
import {
  type FormatUserOperationGasErrorType,
  formatUserOperationGas,
} from "../../utils/formatters/userOperationGas";
import {
  type FormatUserOperationRequestErrorType,
  formatUserOperationRequest,
} from "../../utils/formatters/userOperationRequest";
import {
  type PrepareUserOperationErrorType,
  type PrepareUserOperationParameters,
  prepareUserOperation,
} from "./prepareUserOperation";

export type EstimateUserOperationGasParameters<
  account extends SmartAccount | undefined = SmartAccount | undefined,
  accountOverride extends SmartAccount | undefined = SmartAccount | undefined,
  calls extends readonly unknown[] = readonly unknown[],
  //
  _derivedAccount extends SmartAccount | undefined = DeriveSmartAccount<
    account,
    accountOverride
  >,
  _derivedVersion extends EntryPointVersion = DeriveEntryPointVersion<_derivedAccount>
> = Assign<
  UserOperationRequest<_derivedVersion>,
  OneOf<{ calls: UserOperationCalls<Narrow<calls>> } | { callData: Hex }> & {
    paymaster?:
      | Address
      | true
      | {
          /** Retrieves paymaster-related User Operation properties to be used for sending the User Operation. */
          getPaymasterData?: PaymasterActions["getPaymasterData"] | undefined;
          /** Retrieves paymaster-related User Operation properties to be used for gas estimation. */
          getPaymasterStubData?:
            | PaymasterActions["getPaymasterStubData"]
            | undefined;
        }
      | undefined;
    /** Paymaster context to pass to `getPaymasterData` and `getPaymasterStubData` calls. */
    paymasterContext?: unknown | undefined;
  }
> &
  GetSmartAccountParameter<account, accountOverride>;

export type EstimateUserOperationGasReturnType<
  account extends SmartAccount | undefined = SmartAccount | undefined,
  accountOverride extends SmartAccount | undefined = SmartAccount | undefined,
  //
  _derivedAccount extends SmartAccount | undefined = DeriveSmartAccount<
    account,
    accountOverride
  >,
  _derivedVersion extends EntryPointVersion = DeriveEntryPointVersion<_derivedAccount>
> = Prettify<EstimateUserOperationGasReturnType_<_derivedVersion>>;

export type EstimateUserOperationGasErrorType =
  | ParseAccountErrorType
  | PrepareUserOperationErrorType
  | FormatUserOperationRequestErrorType
  | FormatUserOperationGasErrorType
  | RequestErrorType
  | ErrorType;

/**
 * Returns an estimate of gas values necessary to execute the User Operation.
 *
 * - Docs: https://viem.sh/actions/bundler/estimateUserOperationGas
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateUserOperationGasParameters}
 * @returns The gas estimate (in wei). {@link EstimateUserOperationGasReturnType}
 *
 * @example
 * import { createBundlerClient, http, parseEther } from 'viem'
 * import { toSmartAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { estimateUserOperationGas } from 'viem/actions'
 *
 * const account = await toSmartAccount({ ... })
 *
 * const bundlerClient = createBundlerClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const values = await estimateUserOperationGas(bundlerClient, {
 *   account,
 *   calls: [{ to: '0x...', value: parseEther('1') }],
 * })
 */
export async function estimateUserOperationGas<
  const calls extends readonly unknown[],
  account extends SmartAccount | undefined,
  accountOverride extends SmartAccount | undefined = undefined
>(
  client: Client<Transport, Chain | undefined, account>,
  parameters: EstimateUserOperationGasParameters<
    account,
    accountOverride,
    calls
  >
): Promise<EstimateUserOperationGasReturnType<account, accountOverride>> {
  const { account: account_ = client.account } = parameters;

  if (!account_) throw new AccountNotFoundError();
  const account = parseAccount(account_);

  const request = await getAction(
    client,
    prepareUserOperation,
    "prepareUserOperation"
  )({
    ...parameters,
    parameters: ["factory", "nonce", "paymaster", "signature"],
  } as unknown as PrepareUserOperationParameters);

  try {
    const result = await client.request({
      method: "mina_estimateUserOperationGas",
      params: [
        formatUserOperationRequest(request as UserOperation),
        account.entryPoint.address,
      ],
    });
    return formatUserOperationGas(result) as EstimateUserOperationGasReturnType<
      account,
      accountOverride
    >;
  } catch (error) {
    throw getUserOperationError(error as BaseError, {
      ...(request as UserOperation),
      calls: parameters.calls,
    });
  }
}
