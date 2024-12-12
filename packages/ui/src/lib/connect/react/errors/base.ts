import { BaseError as CoreError } from '@/lib/connect/core/exports'

import { getVersion } from '../utils/getVersion'

export type BaseErrorType = BaseError & { name: 'WagmiError' }

export class BaseError extends CoreError {
  override name = 'WagmiError'

  override get docsBaseUrl() {
    return 'https://wagmi.sh/react'
  }

  override get version() {
    return getVersion()
  }
}
