import type { Connector } from '../createConfig'
import { BaseError } from './base'

export type ProviderNotFoundErrorType = ProviderNotFoundError & {
  name: 'ProviderNotFoundError'
}
export class ProviderNotFoundError extends BaseError {
  override name = 'ProviderNotFoundError'
  constructor() {
    super('Provider not found.')
  }
}

export type SwitchChainNotSupportedErrorType = SwitchChainNotSupportedError & {
  name: 'SwitchChainNotSupportedError'
}
export class SwitchChainNotSupportedError extends BaseError {
  override name = 'SwitchChainNotSupportedError'

  constructor({ connector }: { connector: Connector }) {
    super(`"${connector.name}" does not support programmatic chain switching.`)
  }
}
