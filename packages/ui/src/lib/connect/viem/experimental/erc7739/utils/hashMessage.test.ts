import type { Address } from 'abitype'
import { beforeAll, expect, test } from 'vitest'

import { SoladyAccountFactory07 } from '~contracts/generated'
import { anvilMainnet } from '~test/src/anvil'
import { accounts } from '~test/src/constants'
import { deploySoladyAccount_07 } from '~test/src/utils'
import { sign } from '../../../accounts/index'
import {
  getEip712Domain,
  mine,
  simulateContract,
  verifyMessage,
  writeContract,
} from '../../../actions/index'
import { pad } from '../../../utils/index'
import { hashMessage } from './hashMessage'

const client = anvilMainnet.getClient()

let verifier: Address
beforeAll(async () => {
  const { factoryAddress } = await deploySoladyAccount_07()
  const { result, request } = await simulateContract(client, {
    account: accounts[0].address,
    abi: SoladyAccountFactory07.abi,
    address: factoryAddress,
    functionName: 'createAccount',
    args: [accounts[0].address, pad('0x69')],
  })
  verifier = result
  await writeContract(client, request)
  await mine(client, { blocks: 1 })
})

test('default', async () => {
  const { domain: verifierDomain } = await getEip712Domain(client, {
    address: verifier,
  })

  const message = 'hello world'
  const hash = hashMessage({
    message,
    verifierDomain,
  })

  expect(hash).toBeDefined()

  const signature = await sign({
    hash,
    privateKey: accounts[0].privateKey,
  })
  expect(
    await verifyMessage(client!, {
      address: verifier,
      message,
      signature,
    }),
  ).toBeTruthy()
})
