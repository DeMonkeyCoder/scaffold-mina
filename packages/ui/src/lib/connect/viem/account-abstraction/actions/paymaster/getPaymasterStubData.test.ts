import { describe, expect, test } from 'vitest'
import {
  createVerifyingPaymasterServer,
  getSmartAccounts_07,
  getVerifyingPaymaster_07,
} from '../../../../test/src/account-abstraction'
import { anvilMainnet } from '../../../../test/src/anvil'
import { bundlerMainnet } from '../../../../test/src/bundler'
import { http } from '../../../clients/transports/http'
import { parseEther } from '../../../utils/index'
import { createPaymasterClient } from '../../clients/createPaymasterClient'
import { estimateUserOperationGas } from '../bundler/estimateUserOperationGas'
import { prepareUserOperation } from '../bundler/prepareUserOperation'
import { getPaymasterStubData } from './getPaymasterStubData'

const client = anvilMainnet.getClient({ account: true })
const bundlerClient = bundlerMainnet.getBundlerClient({ client })

describe('entryPointVersion: 0.7', async () => {
  const [account] = await getSmartAccounts_07()
  const paymaster = await getVerifyingPaymaster_07()
  const server = await createVerifyingPaymasterServer(client, { paymaster })

  test('default', async () => {
    const paymasterClient = createPaymasterClient({
      transport: http(server.url),
    })

    const userOperation = await prepareUserOperation(bundlerClient, {
      account,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: parseEther('1'),
        },
      ],
      parameters: ['factory', 'fees', 'nonce', 'signature'],
    })

    const { paymaster, paymasterData, ...userOperation_paymaster } =
      await getPaymasterStubData(paymasterClient, {
        chainId: bundlerClient.chain.id,
        entryPointAddress: account.entryPoint.address,
        ...userOperation,
      })
    expect(paymaster).toBeDefined()
    expect(paymasterData).toBeDefined()
    expect(userOperation_paymaster).toMatchInlineSnapshot(`
      {
        "isFinal": false,
        "paymasterPostOpGasLimit": 1000000n,
        "paymasterVerificationGasLimit": 1000000n,
        "sponsor": {
          "name": "Viem Sugar Daddy",
        },
      }
    `)

    const { preVerificationGas, ...userOperation_gas } =
      await estimateUserOperationGas(bundlerClient, {
        ...userOperation,
        ...userOperation_paymaster,
      })
    expect(preVerificationGas).toBeDefined()
    expect(userOperation_gas).toMatchInlineSnapshot(`
      {
        "callGasLimit": 80000n,
        "paymasterPostOpGasLimit": 0n,
        "paymasterVerificationGasLimit": 0n,
        "verificationGasLimit": 259060n,
      }
    `)
  })
})
