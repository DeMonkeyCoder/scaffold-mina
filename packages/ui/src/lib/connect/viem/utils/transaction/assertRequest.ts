import {parseAccount, type ParseAccountErrorType,} from '../../accounts/utils/parseAccount'
import type {SendTransactionParameters} from '../../actions/wallet/sendTransaction'
import {InvalidAddressError, type InvalidAddressErrorType,} from '../../errors/address'
import type {ErrorType} from '../../errors/utils'
import type {Chain} from '../../types/chain'
import type {ExactPartial} from '../../types/utils'
import {isAddress} from '../address/isAddress'

export type AssertRequestParameters = ExactPartial<
  SendTransactionParameters<Chain>
>

export type AssertRequestErrorType =
  | InvalidAddressErrorType
  | ParseAccountErrorType
  | ErrorType

export function assertRequest(args: AssertRequestParameters) {
  const { account: account_, to, zkappCommand } = args
  if (zkappCommand) return
  const account = account_ ? parseAccount(account_) : undefined
  if (account && !isAddress(account.address))
    throw new InvalidAddressError({ address: account.address })
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to })
}
