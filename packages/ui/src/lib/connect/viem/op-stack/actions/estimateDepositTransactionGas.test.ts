import { beforeAll, expect, test } from 'vitest'
import { anvilMainnet } from '../../../test/src/anvil'
import { accounts } from '../../../test/src/constants'
import { reset, setBalance } from '../../actions/index'
import { parseEther } from '../../index'
import { base } from '../../op-stack/chains'
import { estimateDepositTransactionGas } from './estimateDepositTransactionGas'

const client = anvilMainnet.getClient()

beforeAll(async () => {
  await reset(client, {
    blockNumber: 18136086n,
    jsonRpcUrl: anvilMainnet.forkUrl,
  })
  await setBalance(client, {
    address: accounts[0].address,
    value: parseEther('10000'),
  })
})

test('default', async () => {
  const gas = await estimateDepositTransactionGas(client, {
    account: accounts[0].address,
    request: { gas: 21000n, to: accounts[0].address },
    targetChain: base,
  })
  expect(gas).toBeDefined()
})
