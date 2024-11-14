import { BaseError } from '../../errors/base'

export type TokenIsEthErrorType = TokenIsEthError & {
  name: 'TokenIsEthError'
}
export class TokenIsEthError extends BaseError {
  constructor() {
    super(
      ['Token is an ETH token.', '', 'ETH token cannot be retrieved.'].join(
        '\n',
      ),
      { name: 'TokenIsEthError' },
    )
  }
}
