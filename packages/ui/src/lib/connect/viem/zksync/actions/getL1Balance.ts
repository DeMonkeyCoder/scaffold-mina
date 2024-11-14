import type { Address } from 'abitype'
import { parseAccount } from '../../accounts/utils/parseAccount'
import {
  type GetBalanceParameters,
  getBalance,
} from '../../actions/public/getBalance'
import type { Client } from '../../clients/createClient'
import type { Transport } from '../../clients/transports/createTransport'
import type { AccountNotFoundError } from '../../errors/account'
import type { BaseError } from '../../errors/base'
import type { Account, GetAccountParameter } from '../../types/account'
import type { BlockTag } from '../../types/block'
import type { Chain } from '../../types/chain'
import { legacyEthAddress } from '../constants/address'
import { isEth } from '../utils/isEth'
import {
  type GetL1TokenBalanceParameters,
  getL1TokenBalance,
} from './getL1TokenBalance'

export type GetL1BalanceParameters<
  account extends Account | undefined = Account | undefined,
> = GetAccountParameter<account> & { token?: Address | undefined } & (
    | {
        /** The balance of the account at a block number. */
        blockNumber?: bigint | undefined
        blockTag?: undefined
      }
    | {
        blockNumber?: undefined
        /** The balance of the account at a block tag. */
        blockTag?: BlockTag | undefined
      }
  )

export type GetL1BalanceReturnType = bigint

export type GetL1BalanceErrorType = AccountNotFoundError | BaseError

export async function getL1Balance<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  ...[parameters = {}]: account extends undefined
    ? [GetL1BalanceParameters<account>]
    : [GetL1BalanceParameters<account>] | []
): Promise<GetL1BalanceReturnType> {
  const {
    account: account_ = client.account,
    blockNumber,
    blockTag,
    token = legacyEthAddress,
  } = parameters

  const account = account_ ? parseAccount(account_) : undefined

  if (isEth(token))
    return await getBalance(client, {
      address: account!.address,
      blockNumber,
      blockTag,
    } as GetBalanceParameters)

  return await getL1TokenBalance(client, {
    ...(parameters as GetL1TokenBalanceParameters<account>),
  })
}
