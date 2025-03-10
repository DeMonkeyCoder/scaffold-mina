import { BaseError } from './base'

export type WagmiProviderNotFoundErrorType = WagmiProviderNotFoundError & {
  name: 'WagmiProviderNotFoundError'
}
export class WagmiProviderNotFoundError extends BaseError {
  override name = 'WagmiProviderNotFoundError'
  constructor() {
    super('`useConfig` must be used within `WagmiProvider`.', {
      docsPath: '/api/WagmiProvider',
    })
  }
}
