import { beforeEach, describe, expect, test } from 'vitest'
import {
  getSmartAccounts_06,
  getSmartAccounts_07,
} from '../../../../test/src/account-abstraction'
import { anvilMainnet } from '../../../../test/src/anvil'
import { bundlerMainnet } from '../../../../test/src/bundler'
import { mine } from '../../../actions/index'
import { parseEther, parseGwei } from '../../../utils/index'
import { getUserOperationReceipt } from './getUserOperationReceipt'
import { sendUserOperation } from './sendUserOperation'

const client = anvilMainnet.getClient({ account: true })
const bundlerClient = bundlerMainnet.getBundlerClient()

const fees = {
  maxFeePerGas: parseGwei('7'),
  maxPriorityFeePerGas: parseGwei('1'),
} as const

beforeEach(async () => {
  await bundlerMainnet.restart()
})

describe('entryPointVersion: 0.7', async () => {
  const [account] = await getSmartAccounts_07()

  test('default', async () => {
    const hash = await sendUserOperation(bundlerClient, {
      account,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: parseEther('1'),
        },
      ],
      ...fees,
    })

    await bundlerClient.request({
      method: 'debug_bundler_sendBundleNow',
    })
    await mine(client, {
      blocks: 1,
    })

    const receipt = await getUserOperationReceipt(bundlerClient, {
      hash,
    })

    expect(receipt.success).toBeTruthy()
  })

  test('error: receipt not found', async () => {
    const hash = await sendUserOperation(bundlerClient, {
      account,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: parseEther('1'),
        },
      ],
      ...fees,
    })

    await expect(() =>
      getUserOperationReceipt(bundlerClient, {
        hash,
      }),
    ).rejects.toThrowError(
      'The User Operation may not have been processed yet.',
    )
  })
})

describe('entryPointVersion: 0.6', async () => {
  const [account] = await getSmartAccounts_06()

  test('default', async () => {
    const hash = await sendUserOperation(bundlerClient, {
      account,
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: parseEther('1'),
        },
      ],
      ...fees,
    })

    await bundlerClient.request({
      method: 'debug_bundler_sendBundleNow',
    })
    await mine(client, {
      blocks: 1,
    })

    const receipt = await getUserOperationReceipt(bundlerClient, {
      hash,
    })

    expect(receipt.success).toBeTruthy()
  })
})
