import type { Address } from "@/lib/connect/viem";
import type { Client } from "../../../clients/createClient";
import type { Transport } from "../../../clients/transports/createTransport";
import type { ErrorType } from "../../../errors/utils";
import type { Hex } from "../../../types/misc";
import type { OneOf, PartialBy, Prettify } from "../../../types/utils";
import { hexToBigInt } from "../../../utils/encoding/fromHex";
import { numberToHex } from "../../../utils/encoding/toHex";
import type { UserOperation } from "../../types/userOperation";
import {
  type FormatUserOperationRequestErrorType,
  formatUserOperationRequest,
} from "../../utils/formatters/userOperationRequest";

export type GetPaymasterDataParameters = OneOf<
  | PartialBy<
      Pick<
        UserOperation<"0.6">,
        | "callData"
        | "callGasLimit"
        | "initCode"
        | "maxFeePerGas"
        | "maxPriorityFeePerGas"
        | "nonce"
        | "sender"
        | "preVerificationGas"
        | "verificationGasLimit"
      >,
      | "callGasLimit"
      | "initCode"
      | "maxFeePerGas"
      | "maxPriorityFeePerGas"
      | "preVerificationGas"
      | "verificationGasLimit"
    >
  | PartialBy<
      Pick<
        UserOperation<"0.7">,
        | "callData"
        | "callGasLimit"
        | "factory"
        | "factoryData"
        | "maxFeePerGas"
        | "maxPriorityFeePerGas"
        | "nonce"
        | "sender"
        | "preVerificationGas"
        | "verificationGasLimit"
      >,
      | "callGasLimit"
      | "factory"
      | "factoryData"
      | "maxFeePerGas"
      | "maxPriorityFeePerGas"
      | "preVerificationGas"
      | "verificationGasLimit"
    >
> & {
  context?: unknown | undefined;
  chainId: string;
  entryPointAddress: Address;
};

export type GetPaymasterDataReturnType = Prettify<
  OneOf<
    | { paymasterAndData: Hex }
    | {
        paymaster: Address;
        paymasterData: Hex;
        paymasterVerificationGasLimit: bigint;
        paymasterPostOpGasLimit: bigint;
      }
  >
>;

export type GetPaymasterDataErrorType =
  | FormatUserOperationRequestErrorType
  | ErrorType;

/**
 * Retrieves paymaster-related User Operation properties to be used for sending the User Operation.
 *
 * - Docs: https://viem.sh/account-abstraction/actions/paymaster/getPaymasterData
 *
 * @param client - Client to use
 * @param parameters - {@link GetPaymasterDataParameters}
 * @returns Paymaster-related User Operation properties. {@link GetPaymasterDataReturnType}
 *
 * @example
 * import { http } from 'viem'
 * import { createPaymasterClient, getPaymasterData } from 'viem/account-abstraction'
 *
 * const paymasterClient = createPaymasterClient({
 *   transport: http('https://...'),
 * })
 *
 * const userOperation = { ... }
 *
 * const values = await getPaymasterData(paymasterClient, {
 *   chainId: 1,
 *   entryPointAddress: '0x...',
 *   ...userOperation,
 * })
 */
export async function getPaymasterData(
  client: Client<Transport>,
  parameters: GetPaymasterDataParameters
): Promise<GetPaymasterDataReturnType> {
  const { chainId, entryPointAddress, context, ...userOperation } = parameters;
  const request = formatUserOperationRequest(userOperation);
  const { paymasterPostOpGasLimit, paymasterVerificationGasLimit, ...rest } =
    await client.request({
      method: "pm_getPaymasterData",
      params: [
        {
          ...request,
          callGasLimit: request.callGasLimit ?? "0x0",
          verificationGasLimit: request.verificationGasLimit ?? "0x0",
          preVerificationGas: request.preVerificationGas ?? "0x0",
        },
        entryPointAddress,
        numberToHex(chainId),
        context,
      ],
    });
  return {
    ...rest,
    ...(paymasterPostOpGasLimit && {
      paymasterPostOpGasLimit: hexToBigInt(paymasterPostOpGasLimit),
    }),
    ...(paymasterVerificationGasLimit && {
      paymasterVerificationGasLimit: hexToBigInt(paymasterVerificationGasLimit),
    }),
  } as unknown as GetPaymasterDataReturnType;
}
