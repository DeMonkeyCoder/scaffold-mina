import type { Abi, AbiStateMutability, Address, Narrow } from "abitype";

import type { Client } from "../../../clients/createClient";
import type { Transport } from "../../../clients/transports/createTransport";
import type { ErrorType } from "../../../errors/utils";
import type { Account, GetAccountParameter } from "../../../types/account";
import type { Chain, GetChainParameter } from "../../../types/chain";
import type {
  ContractFunctionArgs,
  ContractFunctionName,
  GetValue,
  UnionWiden,
  Widen,
} from "../../../types/contract";
import type { MulticallContracts } from "../../../types/multicall";
import {
  encodeFunctionData,
  type EncodeFunctionDataErrorType,
} from "../../../utils/abi/encodeFunctionData";
import { getAction } from "../../../utils/getAction";
import {
  sendCalls,
  type SendCallsErrorType,
  type SendCallsParameters,
  type SendCallsReturnType,
} from "./sendCalls";

export type WriteContractsParameters<
  contracts extends readonly unknown[] = readonly WriteContractFunctionParameters[],
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined
> = Pick<
  SendCallsParameters<chain, account, chainOverride>,
  "capabilities" | "version"
> & {
  contracts: MulticallContracts<
    Narrow<contracts>,
    { mutability: AbiStateMutability }
  >;
} & GetAccountParameter<account> &
  GetChainParameter<chain, chainOverride>;

export type WriteContractsReturnType = SendCallsReturnType;

export type WriteContractsErrorType =
  | EncodeFunctionDataErrorType
  | SendCallsErrorType
  | ErrorType;

/**
 * Requests for the wallet to sign and broadcast a batch of write contract calls (transactions) to the network.
 *
 * - Docs: https://viem.sh/experimental/eip5792/writeContracts
 *
 * @param client - Client to use
 * @param parameters - {@link WriteContractsParameters}
 * @returns Unique identifier for the call batch. {@link WriteContractsReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { writeContracts } from 'viem/experimental'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const abi = parseAbi([
 *   'function approve(address, uint256) returns (bool)',
 *   'function transferFrom(address, address, uint256) returns (bool)',
 * ])
 * const id = await writeContracts(client, {
 *   contracts: [
 *     {
 *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *       abi,
 *       functionName: 'approve',
 *       args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC', 100n],
 *     },
 *     {
 *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *       abi,
 *       functionName: 'transferFrom',
 *       args: [
 *         '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 *         '0x0000000000000000000000000000000000000000',
 *         100n
 *       ],
 *     },
 *   ],
 * })
 */
export async function writeContracts<
  const contracts extends readonly unknown[],
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
  chainOverride extends Chain | undefined = undefined
>(
  client: Client<Transport, chain>,
  parameters: WriteContractsParameters<contracts, chain, account, chainOverride>
): Promise<WriteContractsReturnType> {
  const contracts = parameters.contracts as WriteContractFunctionParameters[];
  const calls = contracts.map((contract) => {
    const { address, abi, functionName, args, value } = contract;
    return {
      data: encodeFunctionData({
        abi,
        functionName,
        args,
      }),
      to: address,
      value,
    } satisfies SendCallsParameters["calls"][number];
  });
  return getAction(
    client,
    sendCalls,
    "sendCalls"
  )({ ...parameters, calls } as SendCallsParameters);
}

export type WriteContractFunctionParameters<
  abi extends Abi | readonly unknown[] = Abi,
  mutability extends AbiStateMutability = AbiStateMutability,
  functionName extends ContractFunctionName<
    abi,
    mutability
  > = ContractFunctionName<abi, mutability>,
  args extends ContractFunctionArgs<
    abi,
    mutability,
    functionName
  > = ContractFunctionArgs<abi, mutability, functionName>,
  ///
  allFunctionNames = ContractFunctionName<abi, mutability>,
  allArgs = ContractFunctionArgs<abi, mutability, functionName>
  // when `args` is inferred to `readonly []` ("inputs": []) or `never` (`abi` declared as `Abi` or not inferrable), allow `args` to be optional.
  // important that both branches return same structural type
> = {
  address: Address;
  abi: abi;
  functionName:
    | allFunctionNames // show all options
    | (functionName extends allFunctionNames ? functionName : never); // infer value
  args?: (abi extends Abi ? UnionWiden<args> : never) | allArgs | undefined;
} & (readonly [] extends allArgs ? {} : { args: Widen<args> }) &
  GetValue<abi, functionName>;
