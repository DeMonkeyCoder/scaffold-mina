import {
  getChainId,
  type GetChainIdReturnType,
} from "../../../actions/public/getChainId";
import type { Client } from "../../../clients/createClient";
import type { Transport } from "../../../clients/transports/createTransport";
import type { Chain } from "../../../types/chain";
import type { SmartAccount } from "../../accounts/types";
import {
  estimateUserOperationGas,
  type EstimateUserOperationGasParameters,
  type EstimateUserOperationGasReturnType,
} from "../../actions/bundler/estimateUserOperationGas";
import {
  getSupportedEntryPoints,
  type GetSupportedEntryPointsReturnType,
} from "../../actions/bundler/getSupportedEntryPoints";
import {
  getUserOperation,
  type GetUserOperationParameters,
  type GetUserOperationReturnType,
} from "../../actions/bundler/getUserOperation";
import {
  getUserOperationReceipt,
  type GetUserOperationReceiptParameters,
  type GetUserOperationReceiptReturnType,
} from "../../actions/bundler/getUserOperationReceipt";
import {
  prepareUserOperation,
  type PrepareUserOperationParameters,
  type PrepareUserOperationRequest,
  type PrepareUserOperationReturnType,
} from "../../actions/bundler/prepareUserOperation";
import {
  sendUserOperation,
  type SendUserOperationParameters,
  type SendUserOperationReturnType,
} from "../../actions/bundler/sendUserOperation";
import {
  waitForUserOperationReceipt,
  type WaitForUserOperationReceiptParameters,
  type WaitForUserOperationReceiptReturnType,
} from "../../actions/bundler/waitForUserOperationReceipt";

export type BundlerActions<
  account extends SmartAccount | undefined = SmartAccount | undefined
> = {
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
   * import { mainnet } from 'viem/chains'
   * import { toSmartAccount } from 'viem/accounts'
   *
   * const account = await toSmartAccount({ ... })
   *
   * const bundlerClient = createBundlerClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const values = await bundlerClient.estimateUserOperationGas({
   *   account,
   *   calls: [{ to: '0x...', value: parseEther('1') }],
   * })
   */
  estimateUserOperationGas: <
    const calls extends readonly unknown[],
    accountOverride extends SmartAccount | undefined = undefined
  >(
    parameters: EstimateUserOperationGasParameters<
      account,
      accountOverride,
      calls
    >
  ) => Promise<EstimateUserOperationGasReturnType<account, accountOverride>>;
  /**
   * Returns the chain ID associated with the bundler.
   *
   * - Docs: https://viem.sh/docs/actions/public/getChainId
   * - JSON-RPC Methods: [`mina_networkId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_networkId)
   *
   * @returns The current chain ID. {@link GetChainIdReturnType}
   *
   * @example
   * import { http } from 'viem'
   * import { createBundlerClient, mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const chainId = await client.getChainId()
   * // 1
   */
  getChainId: () => Promise<GetChainIdReturnType>;
  /**
   * Returns the EntryPoints that the bundler supports.
   *
   * - Docs: https://viem.sh/actions/bundler/getSupportedEntryPoints
   *
   * @param client - Client to use
   * @param parameters - {@link GetSupportedEntryPointsParameters}
   * @returns Supported Entry Points. {@link GetSupportedEntryPointsReturnType}
   *
   * @example
   * import { createBundlerClient, http, parseEther } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const bundlerClient = createBundlerClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const addresses = await bundlerClient.getSupportedEntryPoints()
   */
  getSupportedEntryPoints: () => Promise<GetSupportedEntryPointsReturnType>;
  /**
   * Returns the information about a User Operation given a hash.
   *
   * - Docs: https://viem.sh/docs/actions/bundler/getUserOperation
   *
   * @param client - Client to use
   * @param parameters - {@link GetUserOperationParameters}
   * @returns The receipt. {@link GetUserOperationReturnType}
   *
   * @example
   * import { createBundlerClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createBundlerClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const receipt = await client.getUserOperation({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  getUserOperation: (
    parameters: GetUserOperationParameters
  ) => Promise<GetUserOperationReturnType>;
  /**
   * Returns the User Operation Receipt given a User Operation hash.
   *
   * - Docs: https://viem.sh/docs/actions/bundler/getUserOperationReceipt
   *
   * @param client - Client to use
   * @param parameters - {@link GetUserOperationReceiptParameters}
   * @returns The receipt. {@link GetUserOperationReceiptReturnType}
   *
   * @example
   * import { createBundlerClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createBundlerClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const receipt = await client.getUserOperationReceipt({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  getUserOperationReceipt: (
    parameters: GetUserOperationReceiptParameters
  ) => Promise<GetUserOperationReceiptReturnType>;
  /**
   * Prepares a User Operation and fills in missing properties.
   *
   * - Docs: https://viem.sh/actions/bundler/prepareUserOperation
   *
   * @param args - {@link PrepareUserOperationParameters}
   * @returns The User Operation. {@link PrepareUserOperationReturnType}
   *
   * @example
   * import { createBundlerClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { toSmartAccount } from 'viem/accounts'
   *
   * const account = await toSmartAccount({ ... })
   *
   * const client = createBundlerClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const request = await client.prepareUserOperation({
   *   account,
   *   calls: [{ to: '0x...', value: parseEther('1') }],
   * })
   */
  prepareUserOperation: <
    const calls extends readonly unknown[],
    const request extends PrepareUserOperationRequest<
      account,
      accountOverride,
      calls
    >,
    accountOverride extends SmartAccount | undefined = undefined
  >(
    parameters: PrepareUserOperationParameters<
      account,
      accountOverride,
      calls,
      request
    >
  ) => Promise<
    PrepareUserOperationReturnType<account, accountOverride, calls, request>
  >;
  /**
   * Broadcasts a User Operation to the Bundler.
   *
   * - Docs: https://viem.sh/actions/bundler/sendUserOperation
   *
   * @param client - Client to use
   * @param parameters - {@link SendUserOperationParameters}
   * @returns The User Operation hash. {@link SendUserOperationReturnType}
   *
   * @example
   * import { createBundlerClient, http, parseEther } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { toSmartAccount } from 'viem/accounts'
   *
   * const account = toSmartAccount({ ... })
   *
   * const bundlerClient = createBundlerClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const values = await bundlerClient.sendUserOperation({
   *   account,
   *   calls: [{ to: '0x...', value: parseEther('1') }],
   * })
   */
  sendUserOperation: <
    const calls extends readonly unknown[],
    accountOverride extends SmartAccount | undefined = undefined
  >(
    parameters: SendUserOperationParameters<account, accountOverride, calls>
  ) => Promise<SendUserOperationReturnType>;
  /**
   * Waits for the User Operation to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the User Operation receipt.
   *
   * - Docs: https://viem.sh/docs/actions/bundler/waitForUserOperationReceipt
   *
   * @param client - Client to use
   * @param parameters - {@link WaitForUserOperationReceiptParameters}
   * @returns The receipt. {@link WaitForUserOperationReceiptReturnType}
   *
   * @example
   * import { createBundlerClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createBundlerClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   *
   * const receipt = await client.waitForUserOperationReceipt({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  waitForUserOperationReceipt: (
    parameters: WaitForUserOperationReceiptParameters
  ) => Promise<WaitForUserOperationReceiptReturnType>;
};

export function bundlerActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends SmartAccount | undefined = SmartAccount | undefined
>(client: Client<transport, chain, account>): BundlerActions<account> {
  return {
    estimateUserOperationGas: (parameters) =>
      estimateUserOperationGas(client, parameters),
    getChainId: () => getChainId(client),
    getSupportedEntryPoints: () => getSupportedEntryPoints(client),
    getUserOperation: (parameters) => getUserOperation(client, parameters),
    getUserOperationReceipt: (parameters) =>
      getUserOperationReceipt(client, parameters),
    prepareUserOperation: (parameters) =>
      prepareUserOperation(client, parameters),
    sendUserOperation: (parameters) => sendUserOperation(client, parameters),
    waitForUserOperationReceipt: (parameters) =>
      waitForUserOperationReceipt(client, parameters),
  };
}
