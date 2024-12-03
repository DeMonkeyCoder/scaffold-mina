// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type Abi,
  type AbiFunction,
  type AbiParameter,
  type AbiEvent,
  type AbiStateMutability,
  type AbiParameterKind,
  type AbiParameterToPrimitiveType,
  type Narrow,
  type ParseAbi,
  type ParseAbiItem,
  type ParseAbiParameter,
  type ParseAbiParameters,
  type ResolvedRegister,
  type TypedData,
  type TypedDataDomain,
  type TypedDataParameter,
  CircularReferenceError,
  InvalidAbiParameterError,
  InvalidAbiParametersError,
  InvalidAbiItemError,
  InvalidAbiTypeParameterError,
  InvalidFunctionModifierError,
  InvalidModifierError,
  InvalidParameterError,
  InvalidParenthesisError,
  InvalidSignatureError,
  InvalidStructSignatureError,
  SolidityProtectedKeywordError,
  UnknownTypeError,
  UnknownSignatureError,
  parseAbi,
  parseAbiItem,
  parseAbiParameter,
  parseAbiParameters,
} from "abitype";

export {
  type AddChainErrorType,
  type AddChainParameters,
} from "./actions/wallet/addChain";
export type {
  GetAddressesErrorType,
  GetAddressesReturnType,
} from "./actions/wallet/getAddresses";
export type {
  GetBalanceErrorType,
  GetBalanceParameters,
  GetBalanceReturnType,
} from "./actions/public/getBalance";
export type {
  GetBlockHashErrorType,
  GetBlockHashParameters,
  GetBlockHashReturnType,
} from "./actions/public/getBlockHash";
export type {
  GetNetworkIdErrorType,
  GetNetworkIdReturnType,
} from "./actions/public/getNetworkId";
export type {
  GetTransactionCountErrorType,
  GetTransactionCountParameters,
  GetTransactionCountReturnType,
} from "./actions/public/getTransactionCount";
export type {
  GetPermissionsErrorType,
  GetPermissionsReturnType,
} from "./actions/wallet/getPermissions";
export type {
  OnBlockHashFn,
  OnBlockHashParameter,
  WatchBlockHashErrorType,
  WatchBlockHashParameters,
  WatchBlockHashReturnType,
} from "./actions/public/watchBlockHash";
export type {
  RequestAddressesErrorType,
  RequestAddressesReturnType,
} from "./actions/wallet/requestAddresses";
export type {
  RequestPermissionsErrorType,
  RequestPermissionsReturnType,
  RequestPermissionsParameters,
} from "./actions/wallet/requestPermissions";
export type {
  SwitchChainErrorType,
  SwitchChainParameters,
} from "./actions/wallet/switchChain";
export type {
  Chain,
  ChainContract,
  ChainFormatter,
  DeriveChain,
  GetChainParameter,
  ChainFormatters,
  ChainSerializers,
  ExtractChainFormatterExclude,
  ExtractChainFormatterParameters,
  ExtractChainFormatterReturnType,
} from "./types/chain";
export {
  type Client,
  type ClientConfig,
  type CreateClientErrorType,
  type MulticallBatchOptions,
  createClient,
  rpcSchema,
} from "./clients/createClient";
export {
  type CustomTransport,
  type CustomTransportConfig,
  type CustomTransportErrorType,
  custom,
} from "./clients/transports/custom";
export {
  type FallbackTransport,
  type FallbackTransportConfig,
  type FallbackTransportErrorType,
  fallback,
} from "./clients/transports/fallback";
export {
  type HttpTransport,
  type HttpTransportConfig,
  type HttpTransportErrorType,
  http,
} from "./clients/transports/http";
export {
  type PublicClient,
  type PublicClientConfig,
  type CreatePublicClientErrorType,
  createPublicClient,
} from "./clients/createPublicClient";
export { type PublicActions, publicActions } from "./clients/decorators/public";
export { type WalletActions, walletActions } from "./clients/decorators/wallet";
export {
  type Transport,
  type TransportConfig,
  type CreateTransportErrorType,
  createTransport,
} from "./clients/transports/createTransport";
export {
  type WalletClient,
  type WalletClientConfig,
  type CreateWalletClientErrorType,
  createWalletClient,
} from "./clients/createWalletClient";
export {
  type WebSocketTransport,
  type WebSocketTransportConfig,
  type WebSocketTransportErrorType,
  webSocket,
} from "./clients/transports/webSocket";
export { BaseError, type BaseErrorType, setErrorConfig } from "./errors/base";
export {
  BlockNotFoundError,
  type BlockNotFoundErrorType,
} from "./errors/block";
export {
  ChainDisconnectedError,
  type ChainDisconnectedErrorType,
  InternalRpcError,
  type InternalRpcErrorType,
  InvalidInputRpcError,
  type InvalidInputRpcErrorType,
  InvalidParamsRpcError,
  type InvalidParamsRpcErrorType,
  InvalidRequestRpcError,
  type InvalidRequestRpcErrorType,
  JsonRpcVersionUnsupportedError,
  type JsonRpcVersionUnsupportedErrorType,
  LimitExceededRpcError,
  type LimitExceededRpcErrorType,
  MethodNotFoundRpcError,
  type MethodNotFoundRpcErrorType,
  MethodNotSupportedRpcError,
  type MethodNotSupportedRpcErrorType,
  ParseRpcError,
  type ParseRpcErrorType,
  ProviderDisconnectedError,
  type ProviderDisconnectedErrorType,
  ProviderRpcError,
  type ProviderRpcErrorCode,
  type ProviderRpcErrorType,
  ResourceNotFoundRpcError,
  type ResourceNotFoundRpcErrorType,
  ResourceUnavailableRpcError,
  type ResourceUnavailableRpcErrorType,
  RpcError,
  type RpcErrorType,
  type RpcErrorCode,
  SwitchChainError,
  TransactionRejectedRpcError,
  type TransactionRejectedRpcErrorType,
  UnauthorizedProviderError,
  type UnauthorizedProviderErrorType,
  UnknownRpcError,
  type UnknownRpcErrorType,
  UnsupportedProviderMethodError,
  type UnsupportedProviderMethodErrorType,
  UserRejectedRequestError,
  type UserRejectedRequestErrorType,
} from "./errors/rpc";
export {
  ChainDoesNotSupportContract,
  type ChainDoesNotSupportContractErrorType,
  ChainMismatchError,
  type ChainMismatchErrorType,
  ChainNotFoundError,
  type ChainNotFoundErrorType,
  ClientChainNotConfiguredError,
  type ClientChainNotConfiguredErrorType,
  InvalidNetworkIdError,
  type InvalidNetworkIdErrorType,
} from "./errors/chain";
export {
  InvalidBytesBooleanError,
  type InvalidBytesBooleanErrorType,
  IntegerOutOfRangeError,
  type IntegerOutOfRangeErrorType,
  InvalidHexBooleanError,
  type InvalidHexBooleanErrorType,
  InvalidHexValueError,
  type InvalidHexValueErrorType,
  SizeOverflowError,
  type SizeOverflowErrorType,
} from "./errors/encoding";
export {
  HttpRequestError,
  type HttpRequestErrorType,
  RpcRequestError,
  type RpcRequestErrorType,
  TimeoutError,
  type TimeoutErrorType,
  SocketClosedError,
  type SocketClosedErrorType,
  WebSocketRequestError,
  type WebSocketRequestErrorType,
} from "./errors/request";
export {
  InvalidAddressError,
  type InvalidAddressErrorType,
} from "./errors/address";
export {
  SizeExceedsPaddingSizeError,
  type SizeExceedsPaddingSizeErrorType,
  SliceOffsetOutOfBoundsError,
  type SliceOffsetOutOfBoundsErrorType,
} from "./errors/data";
export {
  UrlRequiredError,
  type UrlRequiredErrorType,
} from "./errors/transport";
export {
  AccountStateConflictError,
  type AccountStateConflictErrorType,
  StateAssignmentConflictError,
  type StateAssignmentConflictErrorType,
} from "./errors/stateOverride";
export type {
  Assign,
  Branded,
  Evaluate,
  IsNarrowable,
  IsUndefined,
  IsUnion,
  LooseOmit,
  MaybePartial,
  MaybePromise,
  MaybeRequired,
  Mutable,
  NoInfer,
  NoUndefined,
  Omit,
  Or,
  PartialBy,
  RequiredBy,
  Some,
  UnionEvaluate,
  UnionLooseOmit,
  ValueOf,
  Prettify,
  ExactPartial,
  ExactRequired,
  IsNever,
  OneOf,
  UnionOmit,
  UnionPartialBy,
  UnionPick,
  UnionRequiredBy,
  UnionToTuple,
} from "./types/utils";
export type {
  Account,
  AccountSource,
  CustomSource,
  HDAccount,
  HDOptions,
  JsonRpcAccount,
  LocalAccount,
  PrivateKeyAccount,
} from "./accounts/types";
export type {
  Block,
  BlockIdentifier,
  BlockHash,
  BlockTag,
  Uncle,
} from "./types/block";
export type {
  ByteArray,
  Hash,
  Hex,
  LogTopic,
  Signature,
  CompactSignature,
  SignableMessage,
} from "./types/misc";
export type {
  AddEthereumChainParameter,
  EIP1193EventMap,
  EIP1193Events,
  EIP1193Parameters,
  EIP1193Provider,
  EIP1193RequestFn,
  EIP1474Methods,
  ProviderRpcErrorType as EIP1193ProviderRpcErrorType,
  ProviderConnectInfo,
  ProviderMessage,
  PublicRpcSchema,
  NetworkSync,
  RpcSchema,
  RpcSchemaOverride,
  TestRpcSchema,
  WalletCapabilities,
  WalletCapabilitiesRecord,
  WalletCallReceipt,
  WalletGetCallsStatusReturnType,
  WalletGrantPermissionsParameters,
  WalletGrantPermissionsReturnType,
  WalletSendCallsParameters,
  WalletPermissionCaveat,
  WalletPermission,
  WalletRpcSchema,
  WatchAssetParams,
} from "./types/eip1193";
export { ProviderRpcError as EIP1193ProviderRpcError } from "./types/eip1193";
export type { BlobSidecar, BlobSidecars } from "./types/eip4844";
export type { GetTransportConfig, GetPollOptions } from "./types/transport";
export type { ParseAccount, DeriveAccount, HDKey } from "./types/account";
export type {
  Index,
  Quantity,
  RpcBlock,
  RpcBlockIdentifier,
  RpcBlockHash,
  RpcFeeHistory,
  RpcFeeValues,
  RpcLog,
  RpcTransaction,
  RpcTransactionReceipt,
  RpcTransactionRequest,
  RpcUncle,
  Status,
  RpcProof,
  RpcAccountStateOverride,
  RpcStateOverride,
  RpcStateMapping,
} from "./types/rpc";
export type { Withdrawal } from "./types/withdrawal";
export type { StateMapping, StateOverride } from "./types/stateOverride";
export {
  type BoolToBytesErrorType,
  type BoolToBytesOpts,
  boolToBytes,
  type HexToBytesErrorType,
  type HexToBytesOpts,
  hexToBytes,
  type NumberToBytesErrorType,
  numberToBytes,
  type StringToBytesErrorType,
  type StringToBytesOpts,
  stringToBytes,
  type ToBytesErrorType,
  type ToBytesParameters,
  toBytes,
} from "./utils/encoding/toBytes";
export {
  type BoolToHexErrorType,
  type BoolToHexOpts,
  boolToHex,
  type BytesToHexErrorType,
  type BytesToHexOpts,
  bytesToHex,
  type NumberToHexErrorType,
  type NumberToHexOpts,
  numberToHex,
  type StringToHexErrorType,
  type StringToHexOpts,
  stringToHex,
  type ToHexErrorType,
  type ToHexParameters,
  toHex,
} from "./utils/encoding/toHex";
export {
  type ConcatBytesErrorType,
  type ConcatErrorType,
  type ConcatHexErrorType,
  type ConcatReturnType,
  concat,
  concatBytes,
  concatHex,
} from "./utils/data/concat";
export {
  type AssertCurrentChainErrorType,
  type AssertCurrentChainParameters,
  assertCurrentChain,
} from "./utils/chain/assertCurrentChain";
export { defineChain } from "./utils/chain/defineChain";
export {
  type ExtractChainErrorType,
  type ExtractChainParameters,
  type ExtractChainReturnType,
  extractChain,
} from "./utils/chain/extractChain";
export { type WithRetryErrorType, withRetry } from "./utils/promise/withRetry";
export {
  type WithTimeoutErrorType,
  withTimeout,
} from "./utils/promise/withTimeout";
export {
  type ChecksumAddressErrorType,
  type GetAddressErrorType,
  checksumAddress,
  getAddress,
} from "./utils/address/getAddress";
export {
  type IsAddressOptions,
  type IsAddressErrorType,
  isAddress,
} from "./utils/address/isAddress";
export {
  type IsAddressEqualReturnType,
  type IsAddressEqualErrorType,
  isAddressEqual,
} from "./utils/address/isAddressEqual";
export { type IsHexErrorType, isHex } from "./utils/data/isHex";
export {
  type Sha256Hash,
  type Sha256ErrorType,
  sha256,
} from "./utils/hash/sha256";
export {
  type PadBytesErrorType,
  type PadErrorType,
  type PadHexErrorType,
  type PadReturnType,
  pad,
  padBytes,
  padHex,
} from "./utils/data/pad";
export { type SizeErrorType, size } from "./utils/data/size";
export {
  type SliceBytesErrorType,
  type SliceErrorType,
  type SliceHexErrorType,
  slice,
  sliceBytes,
  sliceHex,
} from "./utils/data/slice";
export { type StringifyErrorType, stringify } from "./utils/stringify";
export {
  type TrimErrorType,
  type TrimReturnType,
  trim,
} from "./utils/data/trim";
export {
  type CreateNonceManagerParameters,
  type NonceManager,
  type NonceManagerSource,
  createNonceManager,
  nonceManager,
} from "./utils/nonceManager";

export type Address = string;
