import { type Address as EthAddress, parseAbi } from "abitype";
import { type Address } from "@/lib/connect/viem";

import type { Account } from "../../accounts/types";
import {
  parseAccount,
  type ParseAccountErrorType,
} from "../../accounts/utils/parseAccount";
import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import { multicall3Abi } from "../../constants/abis";
import { aggregate3Signature } from "../../constants/contract";
import {
  deploylessCallViaBytecodeBytecode,
  deploylessCallViaFactoryBytecode,
} from "../../constants/contracts";
import { BaseError } from "../../errors/base";
import {
  ChainDoesNotSupportContract,
  ClientChainNotConfiguredError,
} from "../../errors/chain";
import {
  CounterfactualDeploymentFailedError,
  RawContractError,
  type RawContractErrorType,
} from "../../errors/contract";
import type { ErrorType } from "../../errors/utils";
import type { BlockTag } from "../../types/block";
import type { Chain } from "../../types/chain";
import type { Hex } from "../../types/misc";
import type { RpcTransactionRequest } from "../../types/rpc";
import type { StateOverride } from "../../types/stateOverride";
import type { TransactionRequest } from "../../types/transaction";
import type { ExactPartial, UnionOmit } from "../../types/utils";
import {
  decodeFunctionResult,
  type DecodeFunctionResultErrorType,
} from "../../utils/abi/decodeFunctionResult";
import {
  encodeDeployData,
  type EncodeDeployDataErrorType,
} from "../../utils/abi/encodeDeployData";
import {
  encodeFunctionData,
  type EncodeFunctionDataErrorType,
} from "../../utils/abi/encodeFunctionData";
import type { RequestErrorType } from "../../utils/buildRequest";
import {
  getChainContractAddress,
  type GetChainContractAddressErrorType,
} from "../../utils/chain/getChainContractAddress";
import {
  numberToHex,
  type NumberToHexErrorType,
} from "../../utils/encoding/toHex";
import {
  getCallError,
  type GetCallErrorReturnType,
} from "../../utils/errors/getCallError";
import { extract } from "../../utils/formatters/extract";
import {
  type FormattedTransactionRequest,
  formatTransactionRequest,
  type FormatTransactionRequestErrorType,
} from "../../utils/formatters/transactionRequest";
import {
  createBatchScheduler,
  type CreateBatchSchedulerErrorType,
} from "../../utils/promise/createBatchScheduler";
import {
  serializeStateOverride,
  type SerializeStateOverrideErrorType,
} from "../../utils/stateOverride";
import type {
  AssertRequestErrorType,
  AssertRequestParameters,
} from "../../utils/transaction/assertRequest";
import { assertRequest } from "../../utils/transaction/assertRequest";

export type CallParameters<
  chain extends Chain | undefined = Chain | undefined
> = UnionOmit<FormattedCall<chain>, "from"> & {
  /** Account attached to the call (msg.sender). */
  account?: Account | Address | undefined;
  /** Whether or not to enable multicall batching on this call. */
  batch?: boolean | undefined;
  /** Bytecode to perform the call on. */
  code?: Hex | undefined;
  /** Contract deployment factory address (ie. Create2 factory, Smart Account factory, etc). */
  factory?: Address | undefined;
  /** Calldata to execute on the factory to deploy the contract. */
  factoryData?: Hex | undefined;
  /** State overrides for the call. */
  stateOverride?: StateOverride | undefined;
} & (
    | {
        /** The balance of the account at a block number. */
        blockNumber?: bigint | undefined;
        blockTag?: undefined;
      }
    | {
        blockNumber?: undefined;
        /**
         * The balance of the account at a block tag.
         * @default 'latest'
         */
        blockTag?: BlockTag | undefined;
      }
  );
type FormattedCall<chain extends Chain | undefined = Chain | undefined> =
  FormattedTransactionRequest<chain>;

export type CallReturnType = { data: Hex | undefined };

export type CallErrorType = GetCallErrorReturnType<
  | ParseAccountErrorType
  | SerializeStateOverrideErrorType
  | AssertRequestErrorType
  | NumberToHexErrorType
  | FormatTransactionRequestErrorType
  | ScheduleMulticallErrorType
  | RequestErrorType
  | ToDeploylessCallViaBytecodeDataErrorType
  | ToDeploylessCallViaFactoryDataErrorType
>;

/**
 * Executes a new message call immediately without submitting a transaction to the networkID.
 *
 * - Docs: https://viem.sh/docs/actions/public/call
 * - JSON-RPC Methods: [`mina_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_call)
 *
 * @param client - Client to use
 * @param parameters - {@link CallParameters}
 * @returns The call data. {@link CallReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { call } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const data = await call(client, {
 *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 * })
 */
export async function call<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  args: CallParameters<chain>
): Promise<CallReturnType> {
  const {
    account: account_ = client.account,
    batch = Boolean(client.batch?.multicall),
    blockNumber,
    blockTag = "latest",
    accessList,
    blobs,
    code,
    data: data_,
    factory,
    factoryData,
    gas,
    gasPrice,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value,
    stateOverride,
    ...rest
  } = args;
  const account = account_ ? parseAccount(account_) : undefined;

  if (code && (factory || factoryData))
    throw new BaseError(
      "Cannot provide both `code` & `factory`/`factoryData` as parameters."
    );
  if (code && to)
    throw new BaseError("Cannot provide both `code` & `to` as parameters.");

  // Check if the call is deployless via bytecode.
  const deploylessCallViaBytecode = code && data_;
  // Check if the call is deployless via a factory.
  const deploylessCallViaFactory = factory && factoryData && to && data_;
  const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;

  const data = (() => {
    if (deploylessCallViaBytecode)
      return toDeploylessCallViaBytecodeData({
        code,
        data: data_,
      });
    if (deploylessCallViaFactory)
      return toDeploylessCallViaFactoryData({
        data: data_,
        factory,
        factoryData,
        to,
      });
    return data_;
  })();

  try {
    assertRequest(args as AssertRequestParameters);

    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
    const block = blockNumberHex || blockTag;

    const rpcStateOverride = serializeStateOverride(stateOverride);

    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;

    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      from: account?.address,
      accessList,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to: deploylessCall ? undefined : to,
      value,
    } as TransactionRequest) as TransactionRequest;

    if (batch && shouldPerformMulticall({ request }) && !rpcStateOverride) {
      try {
        return await scheduleMulticall(client, {
          ...request,
          blockNumber,
          blockTag,
        } as unknown as ScheduleMulticallParameters<chain>);
      } catch (err) {
        if (
          !(err instanceof ClientChainNotConfiguredError) &&
          !(err instanceof ChainDoesNotSupportContract)
        )
          throw err;
      }
    }

    const response = await client.request({
      method: "mina_call",
      params: rpcStateOverride
        ? [
            request as ExactPartial<RpcTransactionRequest>,
            block,
            rpcStateOverride,
          ]
        : [request as ExactPartial<RpcTransactionRequest>, block],
    });
    if (response === "0x") return { data: undefined };
    return { data: response };
  } catch (err) {
    const data = getRevertErrorData(err);

    // Check for CCIP-Read offchain lookup signature.
    const { offchainLookup, offchainLookupSignature } = await import(
      "../../utils/ccip"
    );
    if (
      client.ccipRead !== false &&
      data?.slice(0, 10) === offchainLookupSignature &&
      to
    )
      return {
        data: await offchainLookup(client, { data, to: to as EthAddress }),
      };

    // Check for counterfactual deployment error.
    if (deploylessCall && data?.slice(0, 10) === "0x101bb98d")
      throw new CounterfactualDeploymentFailedError({
        factory: factory as EthAddress,
      });

    throw getCallError(err as ErrorType, {
      ...args,
      account,
      chain: client.chain,
    });
  }
}

// We only want to perform a scheduled multicall if:
// - The request has calldata,
// - The request has a target address,
// - The target address is not already the aggregate3 signature,
// - The request has no other properties (`nonce`, `gas`, etc cannot be sent with a multicall).
function shouldPerformMulticall({ request }: { request: TransactionRequest }) {
  const { data, to, ...request_ } = request;
  if (!data) return false;
  if (data.startsWith(aggregate3Signature)) return false;
  if (!to) return false;
  if (
    Object.values(request_).filter((x) => typeof x !== "undefined").length > 0
  )
    return false;
  return true;
}

type ScheduleMulticallParameters<chain extends Chain | undefined> = Pick<
  CallParameters<chain>,
  "blockNumber" | "blockTag"
> & {
  data: Hex;
  multicallAddress?: Address | undefined;
  to: Address;
};

type ScheduleMulticallErrorType =
  | GetChainContractAddressErrorType
  | NumberToHexErrorType
  | CreateBatchSchedulerErrorType
  | EncodeFunctionDataErrorType
  | DecodeFunctionResultErrorType
  | RawContractErrorType
  | ErrorType;

async function scheduleMulticall<chain extends Chain | undefined>(
  client: Client<Transport>,
  args: ScheduleMulticallParameters<chain>
) {
  const { batchSize = 1024, wait = 0 } =
    typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const {
    blockNumber,
    blockTag = "latest",
    data,
    multicallAddress: multicallAddress_,
    to,
  } = args;

  let multicallAddress = multicallAddress_;
  if (!multicallAddress) {
    if (!client.chain) throw new ClientChainNotConfiguredError();

    multicallAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3",
    });
  }

  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  const block = blockNumberHex || blockTag;

  const { schedule } = createBatchScheduler({
    id: `${client.uid}.${block}`,
    wait,
    shouldSplitBatch(args) {
      const size = args.reduce((size, { data }) => size + (data.length - 2), 0);
      return size > batchSize * 2;
    },
    fn: async (
      requests: {
        data: Hex;
        to: Address;
      }[]
    ) => {
      const calls = requests.map((request) => ({
        allowFailure: true,
        callData: request.data,
        target: request.to as EthAddress,
      }));

      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
      });

      const data = await client.request({
        method: "mina_call",
        params: [
          {
            data: calldata,
            to: multicallAddress,
          },
          block,
        ],
      });

      return decodeFunctionResult({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
        data: data || "0x",
      });
    },
  });

  const [{ returnData, success }] = await schedule({ data, to });

  if (!success) throw new RawContractError({ data: returnData });
  if (returnData === "0x") return { data: undefined };
  return { data: returnData };
}

type ToDeploylessCallViaBytecodeDataErrorType =
  | EncodeDeployDataErrorType
  | ErrorType;

function toDeploylessCallViaBytecodeData(parameters: { code: Hex; data: Hex }) {
  const { code, data } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(bytes, bytes)"]),
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [code, data],
  });
}

type ToDeploylessCallViaFactoryDataErrorType =
  | EncodeDeployDataErrorType
  | ErrorType;

function toDeploylessCallViaFactoryData(parameters: {
  data: Hex;
  factory: Address;
  factoryData: Hex;
  to: Address;
}) {
  const { data, factory, factoryData, to } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
    bytecode: deploylessCallViaFactoryBytecode,
    args: [to as EthAddress, data, factory as EthAddress, factoryData],
  });
}

/** @internal */
export type GetRevertErrorDataErrorType = ErrorType;

/** @internal */
export function getRevertErrorData(err: unknown) {
  if (!(err instanceof BaseError)) return undefined;
  const error = err.walk() as RawContractError;
  return typeof error?.data === "object" ? error.data?.data : error.data;
}
