// biome-ignore lint/performance/noBarrelFile: entrypoint
export {
  type SignMessageErrorType,
  type SignMessageParameters,
  type SignMessageReturnType,
  signMessage,
} from './actions/signMessage'
export {
  type SignTypedDataErrorType,
  type SignTypedDataParameters,
  type SignTypedDataReturnType,
  signTypedData,
} from './actions/signTypedData'
export {
  type Erc7739Actions,
  type Erc7739ActionsParameters,
  erc7739Actions,
} from './decorators/erc7739'
export {
  type HashMessageErrorType,
  type HashMessageParameters,
  type HashMessageReturnType,
  hashMessage,
} from './utils/hashMessage'
export {
  type HashTypedDataErrorType,
  type HashTypedDataParameters,
  type HashTypedDataReturnType,
  hashTypedData,
} from './utils/hashTypedData'
export {
  type WrapTypedDataSignatureErrorType,
  type WrapTypedDataSignatureParameters,
  type WrapTypedDataSignatureReturnType,
  wrapTypedDataSignature,
} from './utils/wrapTypedDataSignature'
