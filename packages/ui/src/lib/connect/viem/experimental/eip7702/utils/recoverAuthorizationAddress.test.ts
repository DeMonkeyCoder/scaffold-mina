import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants'

import { wagmiContractConfig } from '../../../../test/src/abis'
import { experimental_signAuthorization } from '../../../accounts/utils/signAuthorization'
import { getAddress } from '../../../utils/address/getAddress'
import { recoverAuthorizationAddress } from './recoverAuthorizationAddress'

test('default', async () => {
  const signedAuthorization = await experimental_signAuthorization({
    contractAddress: wagmiContractConfig.address,
    chainId: 1,
    nonce: 0,
    privateKey: accounts[0].privateKey,
  })
  expect(
    await recoverAuthorizationAddress({
      authorization: signedAuthorization,
    }),
  ).toBe(getAddress(accounts[0].address))
})

test('args: signature', async () => {
  const authorization = {
    contractAddress: wagmiContractConfig.address,
    chainId: 1,
    nonce: 0,
  } as const
  const signature = await experimental_signAuthorization({
    ...authorization,
    privateKey: accounts[0].privateKey,
  })
  expect(
    await recoverAuthorizationAddress({
      authorization,
      signature,
    }),
  ).toBe(getAddress(accounts[0].address))
})

test('args: signature (hex)', async () => {
  const authorization = {
    contractAddress: wagmiContractConfig.address,
    chainId: 1,
    nonce: 0,
  } as const
  const signature = await experimental_signAuthorization({
    ...authorization,
    privateKey: accounts[0].privateKey,
    to: 'hex',
  })
  expect(
    await recoverAuthorizationAddress({
      authorization,
      signature,
    }),
  ).toBe(getAddress(accounts[0].address))
})
