import { expect, test } from 'vitest'

import { accounts } from '~test/src/constants.js'

import { wagmiContractConfig } from '../../../test/src/abis.js'
import { verifyAuthorization } from '../../experimental/eip7702/utils/verifyAuthorization.js'
import { experimental_signAuthorization } from './signAuthorization.js'

test('default', async () => {
  const signedAuthorization = await experimental_signAuthorization({
    contractAddress: wagmiContractConfig.address,
    chainId: 1,
    nonce: 0,
    privateKey: accounts[0].privateKey,
  })

  expect({
    ...signedAuthorization,
    r: null,
    s: null,
    v: null,
    yParity: null,
  }).toMatchInlineSnapshot(
    `
    {
      "chainId": 1,
      "contractAddress": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      "nonce": 0,
      "r": null,
      "s": null,
      "v": null,
      "yParity": null,
    }
  `,
  )
  expect(signedAuthorization.r).toBeDefined()
  expect(signedAuthorization.s).toBeDefined()
  expect(signedAuthorization.v).toBeDefined()
  expect(signedAuthorization.yParity).toBeDefined()
  expect(
    await verifyAuthorization({
      address: accounts[0].address,
      authorization: signedAuthorization,
    }),
  ).toBe(true)
})

test('args: to (hex)', async () => {
  const authorization = {
    contractAddress: wagmiContractConfig.address,
    chainId: 1,
    nonce: 0,
  }
  const signature = await experimental_signAuthorization({
    ...authorization,
    privateKey: accounts[0].privateKey,
    to: 'hex',
  })

  expect(signature).toMatchInlineSnapshot(
    `"0x623129c9fcc520bee4b19fbb5148b178d67e1c854d2baee0e64cd518aad5549f17997fb5ef9d7521c09f0208b1082a9fecbeabdad90ef0a806a50d1b9c7b5d661b"`,
  )
  expect(
    await verifyAuthorization({
      address: accounts[0].address,
      authorization,
      signature,
    }),
  ).toBe(true)
})
