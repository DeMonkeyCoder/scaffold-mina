import { expect, test } from 'vitest'

import { baycContractConfig, payableContractConfig } from '~test/src/abis'
import { accounts } from '~test/src/constants'
import { parseEther } from '../../utils/unit/parseEther'
import { getBalance } from '../public/getBalance'
import { mine } from '../test/mine'
import { setBalance } from '../test/setBalance'

import { anvilMainnet } from '../../../test/src/anvil'
import { deployContract } from './deployContract'

const client = anvilMainnet.getClient()
const clientWithAccount = anvilMainnet.getClient({
  account: accounts[0].address,
})

test('default', async () => {
  const hash = await deployContract(client, {
    ...baycContractConfig,
    args: ['Bored Ape Wagmi Club', 'BAYC', 69420n, 0n],
    account: accounts[0].address,
  })
  expect(hash).toBeDefined()

  await mine(client, { blocks: 1 })
})

test('inferred account', async () => {
  const hash = await deployContract(clientWithAccount, {
    ...baycContractConfig,
    args: ['Bored Ape Wagmi Club', 'BAYC', 69420n, 0n],
  })
  expect(hash).toBeDefined()

  await mine(client, { blocks: 1 })
})

test('no funds', async () => {
  await setBalance(client, {
    address: accounts[0].address,
    value: parseEther('0'),
  })

  await expect(() =>
    deployContract(client, {
      ...baycContractConfig,
      args: ['Bored Ape Wagmi Club', 'BAYC', 69420n, 0n],
      account: accounts[0].address,
    }),
  ).rejects.toThrowErrorMatchingSnapshot()

  await setBalance(client, {
    address: accounts[0].address,
    value: parseEther('10000'),
  })
})

test('send value to contract', async () => {
  await setBalance(client, {
    address: accounts[0].address,
    value: parseEther('2'),
  })

  const hash = await deployContract(client, {
    ...payableContractConfig,
    account: accounts[0].address,
    value: parseEther('1'),
  })
  expect(hash).toBeDefined()

  await mine(client, { blocks: 1 })

  expect(
    await getBalance(client, { address: accounts[0].address }),
  ).toBeLessThan(parseEther('1'))
})
