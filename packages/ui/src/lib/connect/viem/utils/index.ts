// biome-ignore lint/performance/noBarrelFile: entrypoint module
export { type RequestErrorType, buildRequest } from "./buildRequest";

export {
  type AssertCurrentChainErrorType,
  type AssertCurrentChainParameters,
  assertCurrentChain,
} from "./chain/assertCurrentChain";
export { defineChain } from "./chain/defineChain";
export {
  type ExtractChainErrorType,
  type ExtractChainParameters,
  type ExtractChainReturnType,
  extractChain,
} from "./chain/extractChain";
export {
  type GetChainContractAddressErrorType,
  getChainContractAddress,
} from "./chain/getChainContractAddress";

export { arrayRegex, bytesRegex, integerRegex } from "./regex";

export {
  type WebSocketAsyncErrorType,
  type WebSocketAsyncOptions,
  type WebSocketAsyncReturnType,
  type WebSocketErrorType,
  type WebSocketOptions,
  type WebSocketReturnType,
  getSocket,
  rpc,
} from "./rpc/compat";
export {
  type HttpRpcClient,
  type HttpRpcClientOptions,
  type HttpRequestErrorType,
  type HttpRequestParameters,
  type HttpRequestReturnType,
  getHttpRpcClient,
} from "./rpc/http";
export {
  type GetSocketRpcClientErrorType,
  type GetSocketRpcClientParameters,
  type GetSocketParameters,
  type Socket,
  type SocketRpcClient,
  getSocketRpcClient,
  socketClientCache,
} from "./rpc/socket";
export { getWebSocketRpcClient } from "./rpc/webSocket";
export { type StringifyErrorType, stringify } from "./stringify";
export {
  type ParseAbi,
  type ParseAbiItem,
  type ParseAbiParameter,
  type ParseAbiParameters,
  parseAbi,
  parseAbiItem,
  parseAbiParameter,
  parseAbiParameters,
} from "abitype";
export {
  type ParseAccountErrorType,
  parseAccount,
} from "../accounts/utils/parseAccount";
export {
  type PublicKeyToAddressErrorType,
  publicKeyToAddress,
} from "../accounts/utils/publicKeyToAddress";
export {
  type ChecksumAddressErrorType,
  getAddress,
} from "./address/getAddress";
export { type IsAddressErrorType, isAddress } from "./address/isAddress";
export {
  type IsAddressEqualErrorType,
  isAddressEqual,
} from "./address/isAddressEqual";
export {
  type ConcatBytesErrorType,
  type ConcatErrorType,
  type ConcatHexErrorType,
  concat,
  concatBytes,
  concatHex,
} from "./data/concat";
export { type IsBytesErrorType, isBytes } from "./data/isBytes";
export { type IsHexErrorType, isHex } from "./data/isHex";
export {
  type PadBytesErrorType,
  type PadErrorType,
  type PadHexErrorType,
  pad,
  padBytes,
  padHex,
} from "./data/pad";
export { type SizeErrorType, size } from "./data/size";
export {
  type AssertEndOffsetErrorType,
  type AssertStartOffsetErrorType,
  type SliceBytesErrorType,
  type SliceErrorType,
  type SliceHexErrorType,
  type SliceReturnType,
  slice,
  sliceBytes,
  sliceHex,
} from "./data/slice";
export { type TrimErrorType, type TrimReturnType, trim } from "./data/trim";
export { type ExtractErrorType, extract } from "./formatters/extract";
export {
  type BytesToRlpErrorType,
  type HexToRlpErrorType,
  type ToRlpErrorType,
  type ToRlpReturnType,
  toRlp,
} from "./encoding/toRlp";
export {
  type BoolToBytesErrorType,
  type BoolToBytesOpts,
  type HexToBytesErrorType,
  type HexToBytesOpts,
  type NumberToBytesErrorType,
  type StringToBytesErrorType,
  type StringToBytesOpts,
  type ToBytesErrorType,
  type ToBytesParameters,
  boolToBytes,
  toBytes,
  hexToBytes,
  numberToBytes,
  stringToBytes,
} from "./encoding/toBytes";
export {
  type BoolToHexErrorType,
  type BoolToHexOpts,
  type BytesToHexErrorType,
  type BytesToHexOpts,
  type NumberToHexErrorType,
  type NumberToHexOpts,
  type StringToHexErrorType,
  type StringToHexOpts,
  type ToHexErrorType,
  type ToHexParameters,
  boolToHex,
  bytesToHex,
  toHex,
  numberToHex,
  stringToHex,
} from "./encoding/toHex";
export {
  type BytesToBigIntErrorType,
  type BytesToBigIntOpts,
  type BytesToBoolErrorType,
  type BytesToBoolOpts,
  type BytesToNumberErrorType,
  type BytesToNumberOpts,
  type BytesToStringErrorType,
  type BytesToStringOpts,
  type FromBytesErrorType,
  type FromBytesParameters,
  type FromBytesReturnType,
  bytesToBigInt,
  bytesToBigInt as bytesToBigint,
  bytesToBool,
  bytesToNumber,
  bytesToString,
  fromBytes,
} from "./encoding/fromBytes";
export {
  type AssertSizeErrorType,
  type FromHexErrorType,
  type FromHexParameters,
  type FromHexReturnType,
  type HexToBigIntErrorType,
  type HexToBigIntOpts,
  type HexToBoolErrorType,
  type HexToBoolOpts,
  type HexToNumberErrorType,
  type HexToNumberOpts,
  type HexToStringErrorType,
  type HexToStringOpts,
  fromHex,
  hexToBool,
  hexToBigInt,
  hexToNumber,
  hexToString,
} from "./encoding/fromHex";
export { type FromRlpErrorType, fromRlp } from "./encoding/fromRlp";
export { getAction } from "./getAction";
export {
  type DefineFormatterErrorType,
  defineFormatter,
} from "./formatters/formatter";
export {
  type ToEventSelectorErrorType,
  toEventSelector,
  /** @deprecated use `ToEventSelectorErrorType`. */
  type ToEventSelectorErrorType as GetEventSelectorErrorType,
  /** @deprecated use `toEventSelector`. */
  toEventSelector as getEventSelector,
} from "./hash/toEventSelector";
export {
  type ToFunctionSelectorErrorType,
  toFunctionSelector,
  /** @deprecated use `ToFunctionSelectorErrorType`. */
  type ToFunctionSelectorErrorType as GetFunctionSelectorErrorType,
  /** @deprecated use `toFunctionSelector`. */
  toFunctionSelector as getFunctionSelector,
} from "./hash/toFunctionSelector";
export {
  type ToEventSignatureErrorType,
  toEventSignature,
  /** @deprecated use `ToEventSignatureErrorType`. */
  type ToEventSignatureErrorType as GetEventSignatureErrorType,
  /** @deprecated use `toEventSignature`. */
  toEventSignature as getEventSignature,
} from "./hash/toEventSignature";
export {
  type ToFunctionSignatureErrorType,
  toFunctionSignature,
  /** @deprecated use `ToFunctionSignatureErrorType`. */
  type ToFunctionSignatureErrorType as GetFunctionSignatureErrorType,
  /** @deprecated use `toFunctionSignature`. */
  toFunctionSignature as getFunctionSignature,
} from "./hash/toFunctionSignature";
export { type ToEventHashErrorType, toEventHash } from "./hash/toEventHash";
export {
  type ToFunctionHashErrorType,
  toFunctionHash,
} from "./hash/toFunctionHash";
export { type IsHashErrorType, isHash } from "./hash/isHash";
export { type Keccak256ErrorType, keccak256 } from "./hash/keccak256";
export { type Sha256ErrorType, sha256 } from "./hash/sha256";
export { type Ripemd160ErrorType, ripemd160 } from "./hash/ripemd160";
export {
  type CreateNonceManagerParameters,
  type NonceManager,
  type NonceManagerSource,
  createNonceManager,
  nonceManager,
} from "./nonceManager";
