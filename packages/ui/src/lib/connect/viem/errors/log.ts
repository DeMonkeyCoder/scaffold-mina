import { BaseError } from './base'

export type FilterTypeNotSupportedErrorType = FilterTypeNotSupportedError & {
  name: 'FilterTypeNotSupportedError'
}
export class FilterTypeNotSupportedError extends BaseError {
  constructor(type: string) {
    super(`Filter type "${type}" is not supported.`, {
      name: 'FilterTypeNotSupportedError',
    })
  }
}
