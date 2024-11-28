import type { Abi, AbiEvent, Address } from "abitype";

import {
  call,
  type CallParameters,
  type CallReturnType,
} from "../../actions/public/call";
import {
  createBlockFilter,
  type CreateBlockFilterReturnType,
} from "../../actions/public/createBlockFilter";
import {
  createContractEventFilter,
  type CreateContractEventFilterParameters,
  type CreateContractEventFilterReturnType,
} from "../../actions/public/createContractEventFilter";
import {
  createEventFilter,
  type CreateEventFilterParameters,
  type CreateEventFilterReturnType,
} from "../../actions/public/createEventFilter";
import {
  createPendingTransactionFilter,
  type CreatePendingTransactionFilterReturnType,
} from "../../actions/public/createPendingTransactionFilter";
import {
  estimateContractGas,
  type EstimateContractGasParameters,
  type EstimateContractGasReturnType,
} from "../../actions/public/estimateContractGas";
import {
  estimateFeesPerGas,
  type EstimateFeesPerGasParameters,
  type EstimateFeesPerGasReturnType,
} from "../../actions/public/estimateFeesPerGas";
import {
  estimateGas,
  type EstimateGasParameters,
  type EstimateGasReturnType,
} from "../../actions/public/estimateGas";
import {
  estimateMaxPriorityFeePerGas,
  type EstimateMaxPriorityFeePerGasParameters,
  type EstimateMaxPriorityFeePerGasReturnType,
} from "../../actions/public/estimateMaxPriorityFeePerGas";
import {
  getBalance,
  type GetBalanceParameters,
  type GetBalanceReturnType,
} from "../../actions/public/getBalance";
import {
  getBlobBaseFee,
  type GetBlobBaseFeeReturnType,
} from "../../actions/public/getBlobBaseFee";
import {
  getBlock,
  type GetBlockParameters,
  type GetBlockReturnType,
} from "../../actions/public/getBlock";
import {
  getBlockNumber,
  type GetBlockNumberParameters,
  type GetBlockNumberReturnType,
} from "../../actions/public/getBlockNumber";
import {
  getBlockTransactionCount,
  type GetBlockTransactionCountParameters,
  type GetBlockTransactionCountReturnType,
} from "../../actions/public/getBlockTransactionCount";
import {
  getNetworkId,
  type GetNetworkIdReturnType,
} from "../../actions/public/getNetworkId";
import {
  getCode,
  type GetCodeParameters,
  type GetCodeReturnType,
} from "../../actions/public/getCode";
import {
  getContractEvents,
  type GetContractEventsParameters,
  type GetContractEventsReturnType,
} from "../../actions/public/getContractEvents";
import {
  getFeeHistory,
  type GetFeeHistoryParameters,
  type GetFeeHistoryReturnType,
} from "../../actions/public/getFeeHistory";
import {
  getFilterChanges,
  type GetFilterChangesParameters,
  type GetFilterChangesReturnType,
} from "../../actions/public/getFilterChanges";
import {
  getFilterLogs,
  type GetFilterLogsParameters,
  type GetFilterLogsReturnType,
} from "../../actions/public/getFilterLogs";
import {
  getGasPrice,
  type GetGasPriceReturnType,
} from "../../actions/public/getGasPrice";
import {
  getLogs,
  type GetLogsParameters,
  type GetLogsReturnType,
} from "../../actions/public/getLogs";
import {
  getProof,
  type GetProofParameters,
  type GetProofReturnType,
} from "../../actions/public/getProof";
import {
  getStorageAt,
  type GetStorageAtParameters,
  type GetStorageAtReturnType,
} from "../../actions/public/getStorageAt";
import {
  getTransaction,
  type GetTransactionParameters,
  type GetTransactionReturnType,
} from "../../actions/public/getTransaction";
import {
  getTransactionConfirmations,
  type GetTransactionConfirmationsParameters,
  type GetTransactionConfirmationsReturnType,
} from "../../actions/public/getTransactionConfirmations";
import {
  getTransactionCount,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
} from "../../actions/public/getTransactionCount";
import {
  getTransactionReceipt,
  type GetTransactionReceiptParameters,
  type GetTransactionReceiptReturnType,
} from "../../actions/public/getTransactionReceipt";
import {
  multicall,
  type MulticallParameters,
  type MulticallReturnType,
} from "../../actions/public/multicall";
import {
  readContract,
  type ReadContractParameters,
  type ReadContractReturnType,
} from "../../actions/public/readContract";
import {
  simulateContract,
  type SimulateContractParameters,
  type SimulateContractReturnType,
} from "../../actions/public/simulateContract";
import {
  uninstallFilter,
  type UninstallFilterParameters,
  type UninstallFilterReturnType,
} from "../../actions/public/uninstallFilter";
import {
  verifyMessage,
  type VerifyMessageParameters,
  type VerifyMessageReturnType,
} from "../../actions/public/verifyMessage";
import {
  waitForTransactionReceipt,
  type WaitForTransactionReceiptParameters,
  type WaitForTransactionReceiptReturnType,
} from "../../actions/public/waitForTransactionReceipt";
import {
  watchBlockNumber,
  type WatchBlockNumberParameters,
  type WatchBlockNumberReturnType,
} from "../../actions/public/watchBlockNumber";
import {
  watchBlocks,
  type WatchBlocksParameters,
  type WatchBlocksReturnType,
} from "../../actions/public/watchBlocks";
import {
  watchContractEvent,
  type WatchContractEventParameters,
  type WatchContractEventReturnType,
} from "../../actions/public/watchContractEvent";
import {
  watchEvent,
  type WatchEventParameters,
  type WatchEventReturnType,
} from "../../actions/public/watchEvent";
import {
  watchPendingTransactions,
  type WatchPendingTransactionsParameters,
  type WatchPendingTransactionsReturnType,
} from "../../actions/public/watchPendingTransactions";
import {
  verifySiweMessage,
  type VerifySiweMessageParameters,
  type VerifySiweMessageReturnType,
} from "../../actions/siwe/verifySiweMessage";
import {
  prepareTransactionRequest,
  type PrepareTransactionRequestParameters,
  type PrepareTransactionRequestRequest,
  type PrepareTransactionRequestReturnType,
} from "../../actions/wallet/prepareTransactionRequest";
import {
  sendRawTransaction,
  type SendRawTransactionParameters,
  type SendRawTransactionReturnType,
} from "../../actions/wallet/sendRawTransaction";
import type { Account } from "../../types/account";
import type { BlockNumber, BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";
import type {
  ContractEventName,
  ContractFunctionArgs,
  ContractFunctionName,
  MaybeAbiEventName,
  MaybeExtractEventArgsFromAbi,
} from "../../types/contract";
import type { FeeValuesType } from "../../types/fee";
import type { FilterType } from "../../types/filter";
import type { Client } from "../createClient";
import type { Transport } from "../transports/createTransport";

export type PublicActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
> = {
  /**
   * Executes a new message call immediately without submitting a transaction to the network.
   *
   * - Docs: https://viem.sh/docs/actions/public/call
   * - JSON-RPC Methods: [`mina_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_call)
   *
   * @param args - {@link CallParameters}
   * @returns The call data. {@link CallReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const data = await client.call({
   *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
   *   data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   * })
   */
  call: (parameters: CallParameters<chain>) => Promise<CallReturnType>;
  /**
   * Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
   *
   * - Docs: https://viem.sh/docs/actions/public/createBlockFilter
   * - JSON-RPC Methods: [`mina_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newBlockFilter)
   *
   * @returns Filter. {@link CreateBlockFilterReturnType}
   *
   * @example
   * import { createPublicClient, createBlockFilter, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await createBlockFilter(client)
   * // { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
   */
  createBlockFilter: () => Promise<CreateBlockFilterReturnType>;
  /**
   * Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).
   *
   * - Docs: https://viem.sh/docs/contract/createContractEventFilter
   *
   * @param args - {@link CreateContractEventFilterParameters}
   * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateContractEventFilterReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createContractEventFilter({
   *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
   * })
   */
  createContractEventFilter: <
    const abi extends Abi | readonly unknown[],
    eventName extends ContractEventName<abi> | undefined,
    args extends MaybeExtractEventArgsFromAbi<abi, eventName> | undefined,
    strict extends boolean | undefined = undefined,
    fromBlock extends BlockNumber | BlockTag | undefined = undefined,
    toBlock extends BlockNumber | BlockTag | undefined = undefined
  >(
    args: CreateContractEventFilterParameters<
      abi,
      eventName,
      args,
      strict,
      fromBlock,
      toBlock
    >
  ) => Promise<
    CreateContractEventFilterReturnType<
      abi,
      eventName,
      args,
      strict,
      fromBlock,
      toBlock
    >
  >;
  /**
   * Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
   *
   * - Docs: https://viem.sh/docs/actions/public/createEventFilter
   * - JSON-RPC Methods: [`mina_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newfilter)
   *
   * @param args - {@link CreateEventFilterParameters}
   * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateEventFilterReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createEventFilter({
   *   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
   * })
   */
  createEventFilter: <
    const abiEvent extends AbiEvent | undefined = undefined,
    const abiEvents extends
      | readonly AbiEvent[]
      | readonly unknown[]
      | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
    strict extends boolean | undefined = undefined,
    fromBlock extends BlockNumber | BlockTag | undefined = undefined,
    toBlock extends BlockNumber | BlockTag | undefined = undefined,
    _EventName extends string | undefined = MaybeAbiEventName<abiEvent>,
    _Args extends
      | MaybeExtractEventArgsFromAbi<abiEvents, _EventName>
      | undefined = undefined
  >(
    args?:
      | CreateEventFilterParameters<
          abiEvent,
          abiEvents,
          strict,
          fromBlock,
          toBlock,
          _EventName,
          _Args
        >
      | undefined
  ) => Promise<
    CreateEventFilterReturnType<
      abiEvent,
      abiEvents,
      strict,
      fromBlock,
      toBlock,
      _EventName,
      _Args
    >
  >;
  /**
   * Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
   *
   * - Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
   * - JSON-RPC Methods: [`mina_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newpendingtransactionfilter)
   *
   * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateBlockFilterReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createPendingTransactionFilter()
   * // { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
   */
  createPendingTransactionFilter: () => Promise<CreatePendingTransactionFilterReturnType>;
  /**
   * Estimates the gas required to successfully execute a contract write function call.
   *
   * - Docs: https://viem.sh/docs/contract/estimateContractGas
   *
   * @remarks
   * Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * @param args - {@link EstimateContractGasParameters}
   * @returns The gas estimate (in wei). {@link EstimateContractGasReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const gas = await client.estimateContractGas({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint() public']),
   *   functionName: 'mint',
   *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
   * })
   */
  estimateContractGas: <
    chain extends Chain | undefined,
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
    args extends ContractFunctionArgs<
      abi,
      "nonpayable" | "payable",
      functionName
    >
  >(
    args: EstimateContractGasParameters<abi, functionName, args, chain>
  ) => Promise<EstimateContractGasReturnType>;
  /**
   * Estimates the gas necessary to complete a transaction without submitting it to the network.
   *
   * - Docs: https://viem.sh/docs/actions/public/estimateGas
   * - JSON-RPC Methods: [`mina_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_estimategas)
   *
   * @param args - {@link EstimateGasParameters}
   * @returns The gas estimate (in wei). {@link EstimateGasReturnType}
   *
   * @example
   * import { createPublicClient, http, parseEther } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const gasEstimate = await client.estimateGas({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: parseEther('1'),
   * })
   */
  estimateGas: (
    args: EstimateGasParameters<chain>
  ) => Promise<EstimateGasReturnType>;
  /**
   * Returns the balance of an address in wei.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBalance
   * - JSON-RPC Methods: [`mina_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getbalance)
   *
   * @remarks
   * You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).
   *
   * ```ts
   * const balance = await getBalance(client, {
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   blockTag: 'safe'
   * })
   * const balanceAsEther = formatEther(balance)
   * // "6.942"
   * ```
   *
   * @param args - {@link GetBalanceParameters}
   * @returns The balance of the address in wei. {@link GetBalanceReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const balance = await client.getBalance({
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   * // 10000000000000000000000n (wei)
   */
  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>;
  /**
   * Returns the base fee per blob gas in wei.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
   * - JSON-RPC Methods: [`mina_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_blobBaseFee)
   *
   * @param client - Client to use
   * @returns The blob base fee (in wei). {@link GetBlobBaseFeeReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { getBlobBaseFee } from 'viem/public'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const blobBaseFee = await client.getBlobBaseFee()
   */
  getBlobBaseFee: () => Promise<GetBlobBaseFeeReturnType>;
  /**
   * Returns information about a block at a block number, hash, or tag.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlock
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
   * - JSON-RPC Methods:
   *   - Calls [`mina_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getblockbynumber) for `blockNumber` & `blockTag`.
   *   - Calls [`mina_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getblockbyhash) for `blockHash`.
   *
   * @param args - {@link GetBlockParameters}
   * @returns Information about the block. {@link GetBlockReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const block = await client.getBlock()
   */
  getBlock: <
    includeTransactions extends boolean = false,
    blockTag extends BlockTag = "latest"
  >(
    args?: GetBlockParameters<includeTransactions, blockTag> | undefined
  ) => Promise<GetBlockReturnType<chain, includeTransactions, blockTag>>;
  /**
   * Returns the number of the most recent block seen.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlockNumber
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
   * - JSON-RPC Methods: [`mina_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_blocknumber)
   *
   * @param args - {@link GetBlockNumberParameters}
   * @returns The number of the block. {@link GetBlockNumberReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const blockNumber = await client.getBlockNumber()
   * // 69420n
   */
  getBlockNumber: (
    args?: GetBlockNumberParameters | undefined
  ) => Promise<GetBlockNumberReturnType>;
  /**
   * Returns the number of Transactions at a block number, hash, or tag.
   *
   * - Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
   * - JSON-RPC Methods:
   *   - Calls [`mina_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
   *   - Calls [`mina_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getblocktransactioncountbyhash) for `blockHash`.
   *
   * @param args - {@link GetBlockTransactionCountParameters}
   * @returns The block transaction count. {@link GetBlockTransactionCountReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const count = await client.getBlockTransactionCount()
   */
  getBlockTransactionCount: (
    args?: GetBlockTransactionCountParameters | undefined
  ) => Promise<GetBlockTransactionCountReturnType>;
  /** @deprecated Use `getCode` instead. */
  getBytecode: (args: GetCodeParameters) => Promise<GetCodeReturnType>;
  /**
   * Returns the chain ID associated with the current network.
   *
   * - Docs: https://viem.sh/docs/actions/public/getNetworkId
   * - JSON-RPC Methods: [`mina_networkId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_networkId)
   *
   * @returns The current chain ID. {@link GetNetworkIdReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const networkId = await client.getNetworkId()
   * // 1
   */
  getNetworkId: () => Promise<GetNetworkIdReturnType>;
  /**
   * Retrieves the bytecode at an address.
   *
   * - Docs: https://viem.sh/docs/contract/getCode
   * - JSON-RPC Methods: [`mina_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getcode)
   *
   * @param args - {@link GetBytecodeParameters}
   * @returns The contract's bytecode. {@link GetBytecodeReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const code = await client.getCode({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   * })
   */
  getCode: (args: GetCodeParameters) => Promise<GetCodeReturnType>;
  /**
   * Returns a list of event logs emitted by a contract.
   *
   * - Docs: https://viem.sh/docs/actions/public/getContractEvents
   * - JSON-RPC Methods: [`mina_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getlogs)
   *
   * @param client - Client to use
   * @param parameters - {@link GetContractEventsParameters}
   * @returns A list of event logs. {@link GetContractEventsReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { wagmiAbi } from './abi'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const logs = await client.getContractEvents(client, {
   *  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *  abi: wagmiAbi,
   *  eventName: 'Transfer'
   * })
   */
  getContractEvents: <
    const abi extends Abi | readonly unknown[],
    eventName extends ContractEventName<abi> | undefined = undefined,
    strict extends boolean | undefined = undefined,
    fromBlock extends BlockNumber | BlockTag | undefined = undefined,
    toBlock extends BlockNumber | BlockTag | undefined = undefined
  >(
    args: GetContractEventsParameters<
      abi,
      eventName,
      strict,
      fromBlock,
      toBlock
    >
  ) => Promise<
    GetContractEventsReturnType<abi, eventName, strict, fromBlock, toBlock>
  >;
  getFeeHistory: (
    args: GetFeeHistoryParameters
  ) => Promise<GetFeeHistoryReturnType>;
  /**
   * Returns an estimate for the fees per gas for a transaction to be included
   * in the next block.
   *
   * - Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas
   *
   * @param client - Client to use
   * @param parameters - {@link EstimateFeesPerGasParameters}
   * @returns An estimate (in wei) for the fees per gas. {@link EstimateFeesPerGasReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const maxPriorityFeePerGas = await client.estimateFeesPerGas()
   * // { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
   */
  estimateFeesPerGas: <
    chainOverride extends Chain | undefined = undefined,
    type extends FeeValuesType = "eip1559"
  >(
    args?: EstimateFeesPerGasParameters<chain, chainOverride, type> | undefined
  ) => Promise<EstimateFeesPerGasReturnType<type>>;
  /**
   * Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.
   *
   * - Docs: https://viem.sh/docs/actions/public/getFilterChanges
   * - JSON-RPC Methods: [`mina_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getfilterchanges)
   *
   * @remarks
   * A Filter can be created from the following actions:
   *
   * - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
   * - [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
   * - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
   * - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
   *
   * Depending on the type of filter, the return value will be different:
   *
   * - If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
   * - If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
   * - If the filter was created with `createBlockFilter`, it returns a list of block hashes.
   *
   * @param args - {@link GetFilterChangesParameters}
   * @returns Logs or hashes. {@link GetFilterChangesReturnType}
   *
   * @example
   * // Blocks
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createBlockFilter()
   * const hashes = await client.getFilterChanges({ filter })
   *
   * @example
   * // Contract Events
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createContractEventFilter({
   *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
   *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
   *   eventName: 'Transfer',
   * })
   * const logs = await client.getFilterChanges({ filter })
   *
   * @example
   * // Raw Events
   * import { createPublicClient, http, parseAbiItem } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createEventFilter({
   *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
   *   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
   * })
   * const logs = await client.getFilterChanges({ filter })
   *
   * @example
   * // Transactions
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createPendingTransactionFilter()
   * const hashes = await client.getFilterChanges({ filter })
   */
  getFilterChanges: <
    filterType extends FilterType,
    const abi extends Abi | readonly unknown[] | undefined,
    eventName extends string | undefined,
    strict extends boolean | undefined = undefined,
    fromBlock extends BlockNumber | BlockTag | undefined = undefined,
    toBlock extends BlockNumber | BlockTag | undefined = undefined
  >(
    args: GetFilterChangesParameters<
      filterType,
      abi,
      eventName,
      strict,
      fromBlock,
      toBlock
    >
  ) => Promise<
    GetFilterChangesReturnType<
      filterType,
      abi,
      eventName,
      strict,
      fromBlock,
      toBlock
    >
  >;
  /**
   * Returns a list of event logs since the filter was created.
   *
   * - Docs: https://viem.sh/docs/actions/public/getFilterLogs
   * - JSON-RPC Methods: [`mina_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getfilterlogs)
   *
   * @remarks
   * `getFilterLogs` is only compatible with **event filters**.
   *
   * @param args - {@link GetFilterLogsParameters}
   * @returns A list of event logs. {@link GetFilterLogsReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbiItem } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const filter = await client.createEventFilter({
   *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
   *   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
   * })
   * const logs = await client.getFilterLogs({ filter })
   */
  getFilterLogs: <
    const abi extends Abi | readonly unknown[] | undefined,
    eventName extends string | undefined,
    strict extends boolean | undefined = undefined,
    fromBlock extends BlockNumber | BlockTag | undefined = undefined,
    toBlock extends BlockNumber | BlockTag | undefined = undefined
  >(
    args: GetFilterLogsParameters<abi, eventName, strict, fromBlock, toBlock>
  ) => Promise<
    GetFilterLogsReturnType<abi, eventName, strict, fromBlock, toBlock>
  >;
  /**
   * Returns the current price of gas (in wei).
   *
   * - Docs: https://viem.sh/docs/actions/public/getGasPrice
   * - JSON-RPC Methods: [`mina_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_gasprice)
   *
   * @returns The gas price (in wei). {@link GetGasPriceReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const gasPrice = await client.getGasPrice()
   */
  getGasPrice: () => Promise<GetGasPriceReturnType>;
  /**
   * Returns a list of event logs matching the provided parameters.
   *
   * - Docs: https://viem.sh/docs/actions/public/getLogs
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/filters-and-logs/event-logs
   * - JSON-RPC Methods: [`mina_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getlogs)
   *
   * @param args - {@link GetLogsParameters}
   * @returns A list of event logs. {@link GetLogsReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbiItem } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const logs = await client.getLogs()
   */
  getLogs: <
    const abiEvent extends AbiEvent | undefined = undefined,
    const abiEvents extends
      | readonly AbiEvent[]
      | readonly unknown[]
      | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
    strict extends boolean | undefined = undefined,
    fromBlock extends BlockNumber | BlockTag | undefined = undefined,
    toBlock extends BlockNumber | BlockTag | undefined = undefined
  >(
    args?:
      | GetLogsParameters<abiEvent, abiEvents, strict, fromBlock, toBlock>
      | undefined
  ) => Promise<
    GetLogsReturnType<abiEvent, abiEvents, strict, fromBlock, toBlock>
  >;
  /**
   * Returns the account and storage values of the specified account including the Merkle-proof.
   *
   * - Docs: https://viem.sh/docs/actions/public/getProof
   * - JSON-RPC Methods:
   *   - Calls [`mina_getProof`](https://eips.ethereum.org/EIPS/eip-1186)
   *
   * @param client - Client to use
   * @param parameters - {@link GetProofParameters}
   * @returns Proof data. {@link GetProofReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const block = await client.getProof({
   *  address: '0x...',
   *  storageKeys: ['0x...'],
   * })
   */
  getProof: (args: GetProofParameters) => Promise<GetProofReturnType>;
  /**
   * Returns an estimate for the max priority fee per gas (in wei) for a transaction
   * to be included in the next block.
   *
   * - Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas
   *
   * @param client - Client to use
   * @returns An estimate (in wei) for the max priority fee per gas. {@link EstimateMaxPriorityFeePerGasReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const maxPriorityFeePerGas = await client.estimateMaxPriorityFeePerGas()
   * // 10000000n
   */
  estimateMaxPriorityFeePerGas: <
    chainOverride extends Chain | undefined = undefined
  >(
    args?:
      | EstimateMaxPriorityFeePerGasParameters<chain, chainOverride>
      | undefined
  ) => Promise<EstimateMaxPriorityFeePerGasReturnType>;
  /**
   * Returns the value from a storage slot at a given address.
   *
   * - Docs: https://viem.sh/docs/contract/getStorageAt
   * - JSON-RPC Methods: [`mina_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getstorageat)
   *
   * @param args - {@link GetStorageAtParameters}
   * @returns The value of the storage slot. {@link GetStorageAtReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { getStorageAt } from 'viem/contract'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const code = await client.getStorageAt({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   slot: toHex(0),
   * })
   */
  getStorageAt: (
    args: GetStorageAtParameters
  ) => Promise<GetStorageAtReturnType>;
  /**
   * Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransaction
   * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
   * - JSON-RPC Methods: [`mina_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getTransactionByHash)
   *
   * @param args - {@link GetTransactionParameters}
   * @returns The transaction information. {@link GetTransactionReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transaction = await client.getTransaction({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  getTransaction: <blockTag extends BlockTag = "latest">(
    args: GetTransactionParameters<blockTag>
  ) => Promise<GetTransactionReturnType<chain, blockTag>>;
  /**
   * Returns the number of blocks passed (confirmations) since the transaction was processed on a block.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
   * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
   * - JSON-RPC Methods: [`mina_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getTransactionConfirmations)
   *
   * @param args - {@link GetTransactionConfirmationsParameters}
   * @returns The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. {@link GetTransactionConfirmationsReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const confirmations = await client.getTransactionConfirmations({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  getTransactionConfirmations: (
    args: GetTransactionConfirmationsParameters<chain>
  ) => Promise<GetTransactionConfirmationsReturnType>;
  /**
   * Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransactionCount
   * - JSON-RPC Methods: [`mina_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_gettransactioncount)
   *
   * @param args - {@link GetTransactionCountParameters}
   * @returns The number of transactions an account has sent. {@link GetTransactionCountReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transactionCount = await client.getTransactionCount({
   *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   */
  getTransactionCount: (
    args: GetTransactionCountParameters
  ) => Promise<GetTransactionCountReturnType>;
  /**
   * Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.
   *
   * - Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
   * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
   * - JSON-RPC Methods: [`mina_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getTransactionReceipt)
   *
   * @param args - {@link GetTransactionReceiptParameters}
   * @returns The transaction receipt. {@link GetTransactionReceiptReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transactionReceipt = await client.getTransactionReceipt({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  getTransactionReceipt: (
    args: GetTransactionReceiptParameters
  ) => Promise<GetTransactionReceiptReturnType<chain>>;
  /**
   * Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).
   *
   * - Docs: https://viem.sh/docs/contract/multicall
   *
   * @param args - {@link MulticallParameters}
   * @returns An array of results with accompanying status. {@link MulticallReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const abi = parseAbi([
   *   'function balanceOf(address) view returns (uint256)',
   *   'function totalSupply() view returns (uint256)',
   * ])
   * const result = await client.multicall({
   *   contracts: [
   *     {
   *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *       abi,
   *       functionName: 'balanceOf',
   *       args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
   *     },
   *     {
   *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *       abi,
   *       functionName: 'totalSupply',
   *     },
   *   ],
   * })
   * // [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }]
   */
  multicall: <
    const contracts extends readonly unknown[],
    allowFailure extends boolean = true
  >(
    args: MulticallParameters<contracts, allowFailure>
  ) => Promise<MulticallReturnType<contracts, allowFailure>>;
  /**
   * Prepares a transaction request for signing.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest
   *
   * @param args - {@link PrepareTransactionRequestParameters}
   * @returns The transaction request. {@link PrepareTransactionRequestReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   */
  prepareTransactionRequest: <
    const request extends PrepareTransactionRequestRequest<
      chain,
      chainOverride
    >,
    chainOverride extends Chain | undefined = undefined,
    accountOverride extends Account | Address | undefined = undefined
  >(
    args: PrepareTransactionRequestParameters<
      chain,
      account,
      chainOverride,
      accountOverride,
      request
    >
  ) => Promise<
    PrepareTransactionRequestReturnType<
      chain,
      account,
      chainOverride,
      accountOverride,
      request
    >
  >;
  /**
   * Calls a read-only function on a contract, and returns the response.
   *
   * - Docs: https://viem.sh/docs/contract/readContract
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/reading-contracts
   *
   * @remarks
   * A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.
   *
   * Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * @param args - {@link ReadContractParameters}
   * @returns The response from the contract. Type is inferred. {@link ReadContractReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { readContract } from 'viem/contract'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const result = await client.readContract({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
   *   functionName: 'balanceOf',
   *   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
   * })
   * // 424122n
   */
  readContract: <
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "pure" | "view">,
    args extends ContractFunctionArgs<abi, "pure" | "view", functionName>
  >(
    args: ReadContractParameters<abi, functionName, args>
  ) => Promise<ReadContractReturnType<abi, functionName, args>>;
  /**
   * Sends a **signed** transaction to the network
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
   * - JSON-RPC Method: [`mina_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
   *
   * @param client - Client to use
   * @param parameters - {@link SendRawTransactionParameters}
   * @returns The transaction hash. {@link SendRawTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { sendRawTransaction } from 'viem/wallet'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const hash = await client.sendRawTransaction({
   *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
   * })
   */
  sendRawTransaction: (
    args: SendRawTransactionParameters
  ) => Promise<SendRawTransactionReturnType>;
  /**
   * Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.
   *
   * - Docs: https://viem.sh/docs/contract/simulateContract
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/writing-to-contracts
   *
   * @remarks
   * This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.
   *
   * Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * @param args - {@link SimulateContractParameters}
   * @returns The simulation result and write request. {@link SimulateContractReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const result = await client.simulateContract({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint(uint32) view returns (uint32)']),
   *   functionName: 'mint',
   *   args: ['69420'],
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   * })
   */
  simulateContract: <
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
    args extends ContractFunctionArgs<
      abi,
      "nonpayable" | "payable",
      functionName
    >,
    chainOverride extends Chain | undefined,
    accountOverride extends Account | Address | undefined = undefined
  >(
    args: SimulateContractParameters<
      abi,
      functionName,
      args,
      chain,
      chainOverride,
      accountOverride
    >
  ) => Promise<
    SimulateContractReturnType<
      abi,
      functionName,
      args,
      chain,
      account,
      chainOverride,
      accountOverride
    >
  >;
  /**
   * Verify that a message was signed by the provided address.
   *
   * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
   *
   * - Docs {@link https://viem.sh/docs/actions/public/verifyMessage}
   *
   * @param parameters - {@link VerifyMessageParameters}
   * @returns Whether or not the signature is valid. {@link VerifyMessageReturnType}
   */
  verifyMessage: (
    args: VerifyMessageParameters
  ) => Promise<VerifyMessageReturnType>;
  /**
   * Verifies [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message was signed.
   *
   * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
   *
   * - Docs {@link https://viem.sh/docs/siwe/actions/verifySiweMessage}
   *
   * @param parameters - {@link VerifySiweMessageParameters}
   * @returns Whether or not the signature is valid. {@link VerifySiweMessageReturnType}
   */
  verifySiweMessage: (
    args: VerifySiweMessageParameters
  ) => Promise<VerifySiweMessageReturnType>;
  /**
   * Destroys a Filter that was created from one of the following Actions:
   *
   * - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
   * - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
   * - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
   *
   * - Docs: https://viem.sh/docs/actions/public/uninstallFilter
   * - JSON-RPC Methods: [`mina_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_uninstallFilter)
   *
   * @param args - {@link UninstallFilterParameters}
   * @returns A boolean indicating if the Filter was successfully uninstalled. {@link UninstallFilterReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'
   *
   * const filter = await client.createPendingTransactionFilter()
   * const uninstalled = await client.uninstallFilter({ filter })
   * // true
   */
  uninstallFilter: (
    args: UninstallFilterParameters
  ) => Promise<UninstallFilterReturnType>;
  /**
   * Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error.
   *
   * - Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
   * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/sending-transactions
   * - JSON-RPC Methods:
   *   - Polls [`mina_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getTransactionReceipt) on each block until it has been processed.
   *   - If a Transaction has been replaced:
   *     - Calls [`mina_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getblockbynumber) and extracts the transactions
   *     - Checks if one of the Transactions is a replacement
   *     - If so, calls [`mina_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getTransactionReceipt).
   *
   * @remarks
   * The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).
   *
   * Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.
   *
   * There are 3 types of Transaction Replacement reasons:
   *
   * - `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
   * - `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
   * - `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)
   *
   * @param args - {@link WaitForTransactionReceiptParameters}
   * @returns The transaction receipt. {@link WaitForTransactionReceiptReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const transactionReceipt = await client.waitForTransactionReceipt({
   *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
   * })
   */
  waitForTransactionReceipt: (
    args: WaitForTransactionReceiptParameters<chain>
  ) => Promise<WaitForTransactionReceiptReturnType<chain>>;
  /**
   * Watches and returns incoming block numbers.
   *
   * - Docs: https://viem.sh/docs/actions/public/watchBlockNumber
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks
   * - JSON-RPC Methods:
   *   - When `poll: true`, calls [`mina_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_blocknumber) on a polling interval.
   *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`mina_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
   *
   * @param args - {@link WatchBlockNumberParameters}
   * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlockNumberReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = await client.watchBlockNumber({
   *   onBlockNumber: (blockNumber) => console.log(blockNumber),
   * })
   */
  watchBlockNumber: (
    args: WatchBlockNumberParameters
  ) => WatchBlockNumberReturnType;
  /**
   * Watches and returns information for incoming blocks.
   *
   * - Docs: https://viem.sh/docs/actions/public/watchBlocks
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks
   * - JSON-RPC Methods:
   *   - When `poll: true`, calls [`mina_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getBlockByNumber) on a polling interval.
   *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`mina_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
   *
   * @param args - {@link WatchBlocksParameters}
   * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlocksReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = await client.watchBlocks({
   *   onBlock: (block) => console.log(block),
   * })
   */
  watchBlocks: <
    includeTransactions extends boolean = false,
    blockTag extends BlockTag = "latest"
  >(
    args: WatchBlocksParameters<transport, chain, includeTransactions, blockTag>
  ) => WatchBlocksReturnType;
  /**
   * Watches and returns emitted contract event logs.
   *
   * - Docs: https://viem.sh/docs/contract/watchContractEvent
   *
   * @remarks
   * This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).
   *
   * `watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `mina_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
   *
   * @param args - {@link WatchContractEventParameters}
   * @returns A function that can be invoked to stop watching for new event logs. {@link WatchContractEventReturnType}
   *
   * @example
   * import { createPublicClient, http, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = client.watchContractEvent({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
   *   eventName: 'Transfer',
   *   args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
   *   onLogs: (logs) => console.log(logs),
   * })
   */
  watchContractEvent: <
    const abi extends Abi | readonly unknown[],
    eventName extends ContractEventName<abi>,
    strict extends boolean | undefined = undefined
  >(
    args: WatchContractEventParameters<abi, eventName, strict, transport>
  ) => WatchContractEventReturnType;
  /**
   * Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).
   *
   * - Docs: https://viem.sh/docs/actions/public/watchEvent
   * - JSON-RPC Methods:
   *   - **RPC Provider supports `mina_newFilter`:**
   *     - Calls [`mina_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newfilter) to create a filter (called on initialize).
   *     - On a polling interval, it will call [`mina_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getfilterchanges).
   *   - **RPC Provider does not support `mina_newFilter`:**
   *     - Calls [`mina_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getlogs) for each block between the polling interval.
   *
   * @remarks
   * This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).
   *
   * `watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `mina_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
   *
   * @param args - {@link WatchEventParameters}
   * @returns A function that can be invoked to stop watching for new Event Logs. {@link WatchEventReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = client.watchEvent({
   *   onLogs: (logs) => console.log(logs),
   * })
   */
  watchEvent: <
    const abiEvent extends AbiEvent | undefined = undefined,
    const abiEvents extends
      | readonly AbiEvent[]
      | readonly unknown[]
      | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
    strict extends boolean | undefined = undefined
  >(
    args: WatchEventParameters<abiEvent, abiEvents, strict, transport>
  ) => WatchEventReturnType;
  /**
   * Watches and returns pending transaction hashes.
   *
   * - Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
   * - JSON-RPC Methods:
   *   - When `poll: true`
   *     - Calls [`mina_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_newpendingtransactionfilter) to initialize the filter.
   *     - Calls [`mina_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getFilterChanges) on a polling interval.
   *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`mina_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.
   *
   * @remarks
   * This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).
   *
   * @param args - {@link WatchPendingTransactionsParameters}
   * @returns A function that can be invoked to stop watching for new pending transaction hashes. {@link WatchPendingTransactionsReturnType}
   *
   * @example
   * import { createPublicClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createPublicClient({
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const unwatch = await client.watchPendingTransactions({
   *   onTransactions: (hashes) => console.log(hashes),
   * })
   */
  watchPendingTransactions: (
    args: WatchPendingTransactionsParameters<transport>
  ) => WatchPendingTransactionsReturnType;
};

export function publicActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
>(
  client: Client<transport, chain, account>
): PublicActions<transport, chain, account> {
  return {
    call: (args) => call(client, args),
    createBlockFilter: () => createBlockFilter(client),
    createContractEventFilter: (args) =>
      createContractEventFilter(client, args),
    createEventFilter: (args) => createEventFilter(client, args),
    createPendingTransactionFilter: () =>
      createPendingTransactionFilter(client),
    estimateContractGas: (args) => estimateContractGas(client, args as any),
    estimateGas: (args) => estimateGas(client, args),
    getBalance: (args) => getBalance(client, args),
    getBlobBaseFee: () => getBlobBaseFee(client),
    getBlock: (args) => getBlock(client, args),
    getBlockNumber: (args) => getBlockNumber(client, args),
    getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
    getBytecode: (args) => getCode(client, args),
    getNetworkId: () => getNetworkId(client),
    getCode: (args) => getCode(client, args),
    getContractEvents: (args) => getContractEvents(client, args),
    getFeeHistory: (args) => getFeeHistory(client, args),
    estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
    getFilterChanges: (args) => getFilterChanges(client, args),
    getFilterLogs: (args) => getFilterLogs(client, args),
    getGasPrice: () => getGasPrice(client),
    getLogs: (args) => getLogs(client, args as any),
    getProof: (args) => getProof(client, args),
    estimateMaxPriorityFeePerGas: (args) =>
      estimateMaxPriorityFeePerGas(client, args),
    getStorageAt: (args) => getStorageAt(client, args),
    getTransaction: (args) => getTransaction(client, args),
    getTransactionConfirmations: (args) =>
      getTransactionConfirmations(client, args),
    getTransactionCount: (args) => getTransactionCount(client, args),
    getTransactionReceipt: (args) => getTransactionReceipt(client, args),
    multicall: (args) => multicall(client, args),
    prepareTransactionRequest: (args) =>
      prepareTransactionRequest(client as any, args as any) as any,
    readContract: (args) => readContract(client, args),
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    simulateContract: (args) => simulateContract(client, args),
    verifyMessage: (args) => verifyMessage(client, args),
    verifySiweMessage: (args) => verifySiweMessage(client, args),
    uninstallFilter: (args) => uninstallFilter(client, args),
    waitForTransactionReceipt: (args) =>
      waitForTransactionReceipt(client, args),
    watchBlocks: (args) => watchBlocks(client, args),
    watchBlockNumber: (args) => watchBlockNumber(client, args),
    watchContractEvent: (args) => watchContractEvent(client, args),
    watchEvent: (args) => watchEvent(client, args),
    watchPendingTransactions: (args) => watchPendingTransactions(client, args),
  };
}
