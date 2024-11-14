// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  verifySiweMessage,
  type VerifySiweMessageParameters,
  type VerifySiweMessageReturnType,
  type VerifySiweMessageErrorType,
} from '../actions/siwe/verifySiweMessage'

export {
  createSiweMessage,
  type CreateSiweMessageParameters,
  type CreateSiweMessageReturnType,
  type CreateSiweMessageErrorType,
} from '../utils/siwe/createSiweMessage'

export { generateSiweNonce } from '../utils/siwe/generateSiweNonce'
export { parseSiweMessage } from '../utils/siwe/parseSiweMessage'

export {
  validateSiweMessage,
  type ValidateSiweMessageParameters,
  type ValidateSiweMessageReturnType,
} from '../utils/siwe/validateSiweMessage'

export type { SiweMessage } from '../utils/siwe/types'

export {
  type SiweInvalidMessageFieldErrorType,
  SiweInvalidMessageFieldError,
} from '../errors/siwe'
