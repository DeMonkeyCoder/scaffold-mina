// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type GetCapabilitiesParameters,
  type GetCapabilitiesErrorType,
  type GetCapabilitiesReturnType,
  getCapabilities,
} from "./eip5792/actions/getCapabilities";
export {
  type SendCallsErrorType,
  type SendCallsParameters,
  type SendCallsReturnType,
  sendCalls,
} from "./eip5792/actions/sendCalls";
export {
  type GetCallsStatusErrorType,
  type GetCallsStatusParameters,
  type GetCallsStatusReturnType,
  getCallsStatus,
} from "./eip5792/actions/getCallsStatus";
export {
  type ShowCallsStatusErrorType,
  type ShowCallsStatusParameters,
  type ShowCallsStatusReturnType,
  showCallsStatus,
} from "./eip5792/actions/showCallsStatus";
export {
  type WriteContractsErrorType,
  type WriteContractsParameters,
  type WriteContractsReturnType,
  type WriteContractFunctionParameters,
  writeContracts,
} from "./eip5792/actions/writeContracts";
export {
  /** @deprecated use `Eip5792Actions` instead. */
  type Eip5792Actions as WalletActionsEip5792,
  /** @deprecated use `eip5792Actions` instead. */
  eip5792Actions as walletActionsEip5792,
  type Eip5792Actions,
  eip5792Actions,
} from "./eip5792/decorators/eip5792";

export {
  type Eip7702Actions,
  eip7702Actions,
} from "./eip7702/decorators/eip7702";
export {
  type SignAuthorizationParameters,
  type SignAuthorizationReturnType,
  type SignAuthorizationErrorType,
  signAuthorization,
} from "./eip7702/actions/signAuthorization";
export {
  type Authorization,
  type SignedAuthorization,
  type AuthorizationList,
  type SignedAuthorizationList,
  type SerializedAuthorization,
  type SerializedAuthorizationList,
} from "./eip7702/types/authorization";
export {
  type RpcAuthorizationList,
  type RpcAuthorization,
} from "./eip7702/types/rpc";
export {
  type HashAuthorizationParameters,
  type HashAuthorizationReturnType,
  type HashAuthorizationErrorType,
  hashAuthorization,
} from "./eip7702/utils/hashAuthorization";
export {
  type RecoverAuthorizationAddressParameters,
  type RecoverAuthorizationAddressReturnType,
  type RecoverAuthorizationAddressErrorType,
  recoverAuthorizationAddress,
} from "./eip7702/utils/recoverAuthorizationAddress";
export {
  type SerializeAuthorizationListReturnType,
  type SerializeAuthorizationListErrorType,
  serializeAuthorizationList,
} from "./eip7702/utils/serializeAuthorizationList";
export {
  type VerifyAuthorizationParameters,
  type VerifyAuthorizationReturnType,
  type VerifyAuthorizationErrorType,
  verifyAuthorization,
} from "./eip7702/utils/verifyAuthorization";

export {
  type GrantPermissionsParameters,
  type GrantPermissionsReturnType,
  grantPermissions,
} from "./erc7715/actions/grantPermissions";
export {
  /** @deprecated use `Erc7715Actions` instead. */
  type Erc7715Actions as WalletActionsErc7715,
  /** @deprecated use `erc7715Actions` instead. */
  erc7715Actions as walletActionsErc7715,
  type Erc7715Actions,
  erc7715Actions,
} from "./erc7715/decorators/erc7715";

export {
  /** @deprecated This is no longer experimental – use `import type { ParseErc6492SignatureErrorType } from 'viem'` instead. */
  type ParseErc6492SignatureErrorType,
  /** @deprecated This is no longer experimental – use `import type { ParseErc6492SignatureParameters } from 'viem'` instead. */
  type ParseErc6492SignatureParameters,
  /** @deprecated This is no longer experimental – use `import type { ParseErc6492SignatureReturnType } from 'viem'` instead. */
  type ParseErc6492SignatureReturnType,
  /** @deprecated This is no longer experimental – use `import { parseErc6492Signature } from 'viem'` instead. */
  parseErc6492Signature,
} from "../utils/signature/parseErc6492Signature";
export {
  /** @deprecated This is no longer experimental – use `import type { IsErc6492SignatureErrorType } from 'viem'` instead. */
  type IsErc6492SignatureErrorType,
  /** @deprecated This is no longer experimental – use `import type { IsErc6492SignatureParameters } from 'viem'` instead. */
  type IsErc6492SignatureParameters,
  /** @deprecated This is no longer experimental – use `import type { IsErc6492SignatureReturnType } from 'viem'` instead. */
  type IsErc6492SignatureReturnType,
  /** @deprecated This is no longer experimental – use `import { isErc6492Signature } from 'viem'` instead. */
  isErc6492Signature,
} from "../utils/signature/isErc6492Signature";
export {
  /** @deprecated This is no longer experimental – use `import type { SerializeErc6492SignatureErrorType } from 'viem'` instead. */
  type SerializeErc6492SignatureErrorType,
  /** @deprecated This is no longer experimental – use `import type { SerializeErc6492SignatureParameters } from 'viem'` instead. */
  type SerializeErc6492SignatureParameters,
  /** @deprecated This is no longer experimental – use `import type { SerializeErc6492SignatureReturnType } from 'viem'` instead. */
  type SerializeErc6492SignatureReturnType,
  /** @deprecated This is no longer experimental – use `import { serializeErc6492Signature } from 'viem'` instead. */
  serializeErc6492Signature,
} from "../utils/signature/serializeErc6492Signature";
