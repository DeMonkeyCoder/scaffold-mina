import { describe, expect, test, vi } from 'vitest'

import { BatchCallInvoker, Payable } from '~contracts/generated.js'
import { wagmiContractConfig } from '~test/src/abis.js'
import { accounts } from '~test/src/constants.js'
import { deploy, deployPayable } from '~test/src/utils.js'
import { anvilMainnet } from '../../../test/src/anvil.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import { optimism } from '../../chains/index.js'
import { createWalletClient } from '../../clients/createWalletClient.js'
import { walletActions } from '../../clients/decorators/wallet.js'
import { http } from '../../clients/transports/http.js'
import { signAuthorization } from '../../experimental/index.js'
import { decodeEventLog, parseEther } from '../../utils/index.js'
import { getBalance } from '../public/getBalance.js'
import { getTransaction } from '../public/getTransaction.js'
import { getTransactionReceipt } from '../public/getTransactionReceipt.js'
import { simulateContract } from '../public/simulateContract.js'
import { mine } from '../test/mine.js'
import { writeContract } from './writeContract.js'

const client = anvilMainnet.getClient().extend(walletActions)
const clientWithAccount = anvilMainnet.getClient({
  account: accounts[0].address,
})

test('default', async () => {
  expect(
    await writeContract(client, {
      ...wagmiContractConfig,
      account: accounts[0].address,
      functionName: 'mint',
    }),
  ).toBeDefined()
})

test('inferred account', async () => {
  expect(
    await writeContract(clientWithAccount, {
      ...wagmiContractConfig,
      functionName: 'mint',
    }),
  ).toBeDefined()
})

test('client chain mismatch', async () => {
  const client = createWalletClient({
    chain: optimism,
    transport: http(anvilMainnet.rpcUrl.http),
  })
  await expect(() =>
    writeContract(client, {
      ...wagmiContractConfig,
      account: accounts[0].address,
      functionName: 'mint',
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [TransactionExecutionError: The current chain of the wallet (id: 1) does not match the target chain for the transaction (id: 10 – OP Mainnet).

    Current Chain ID:  1
    Expected Chain ID: 10 – OP Mainnet
     
    Request Arguments:
      from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
      data:  0x1249c58b

    Version: viem@x.y.z]
  `)
})

test('no chain', async () => {
  const client = createWalletClient({
    transport: http(anvilMainnet.rpcUrl.http),
  })
  await expect(() =>
    // @ts-expect-error
    writeContract(client, {
      ...wagmiContractConfig,
      account: accounts[0].address,
      functionName: 'mint',
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [TransactionExecutionError: No chain was provided to the request.
    Please provide a chain with the \`chain\` argument on the Action, or by supplying a \`chain\` to WalletClient.

    Request Arguments:
      from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
      data:  0x1249c58b

    Version: viem@x.y.z]
  `)
})

describe('args: chain', () => {
  test('default', async () => {
    const client = createWalletClient({
      transport: http(anvilMainnet.rpcUrl.http),
    })

    expect(
      await writeContract(client, {
        ...wagmiContractConfig,
        account: accounts[0].address,
        functionName: 'mint',
        chain: anvilMainnet.chain,
      }),
    ).toBeDefined()
  })

  test('chain mismatch', async () => {
    await expect(() =>
      writeContract(client, {
        ...wagmiContractConfig,
        account: accounts[0].address,
        functionName: 'mint',
        chain: optimism,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [TransactionExecutionError: The current chain of the wallet (id: 1) does not match the target chain for the transaction (id: 10 – OP Mainnet).

      Current Chain ID:  1
      Expected Chain ID: 10 – OP Mainnet
       
      Request Arguments:
        chain:  OP Mainnet (id: 10)
        from:   0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:     0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:   0x1249c58b

      Version: viem@x.y.z]
    `)
  })
})

test('args: authorizationList', async () => {
  const invoker = privateKeyToAccount(accounts[0].privateKey)
  const authority = privateKeyToAccount(accounts[1].privateKey)
  const recipient = privateKeyToAccount(
    '0x4a751f9ddcef30fd28648f415480f74eb418bd5145a56586a32e8c959c330742',
  )

  const balance_authority = await getBalance(client, {
    address: authority.address,
  })
  const balance_recipient = await getBalance(client, {
    address: recipient.address,
  })

  const { contractAddress } = await deploy(client, {
    abi: BatchCallInvoker.abi,
    bytecode: BatchCallInvoker.bytecode.object,
  })

  const authorization = await signAuthorization(client, {
    account: authority,
    contractAddress: contractAddress!,
  })

  const hash = await writeContract(client, {
    abi: BatchCallInvoker.abi,
    account: invoker,
    address: authority.address,
    authorizationList: [authorization],
    functionName: 'execute',
    args: [
      [
        {
          to: recipient.address,
          data: '0x',
          value: parseEther('1'),
        },
      ],
    ],
  })
  expect(hash).toBeDefined()

  await mine(client, { blocks: 1 })

  const receipt = await getTransactionReceipt(client, { hash })
  const log = receipt.logs[0]
  expect(log.address).toBe(authority.address.toLowerCase())
  expect(
    decodeEventLog({
      abi: BatchCallInvoker.abi,
      ...log,
    }),
  ).toEqual({
    args: {
      data: '0x',
      to: recipient.address,
      value: parseEther('1'),
    },
    eventName: 'CallEmitted',
  })

  expect(
    await getBalance(client, {
      address: recipient.address,
    }),
  ).toBe(balance_recipient + parseEther('1'))
  expect(
    await getBalance(client, {
      address: authority.address,
    }),
  ).toBe(balance_authority - parseEther('1'))
})

test('args: authorizationList (authority as invoker)', async () => {
  const authority = privateKeyToAccount(accounts[1].privateKey)
  const recipient = privateKeyToAccount(
    '0x4a751f9ddcef30fd28648f415480f74eb418bd5145a56586a32e8c959c330742',
  )

  const balance_recipient = await getBalance(client, {
    address: recipient.address,
  })

  const { contractAddress } = await deploy(client, {
    abi: BatchCallInvoker.abi,
    bytecode: BatchCallInvoker.bytecode.object,
  })

  const authorization = await signAuthorization(client, {
    account: authority,
    contractAddress: contractAddress!,
  })

  const hash = await writeContract(client, {
    abi: BatchCallInvoker.abi,
    account: authority,
    address: authority.address,
    authorizationList: [authorization],
    functionName: 'execute',
    args: [
      [
        {
          to: recipient.address,
          data: '0x',
          value: parseEther('1'),
        },
      ],
    ],
  })
  expect(hash).toBeDefined()

  await mine(client, { blocks: 1 })

  const receipt = await getTransactionReceipt(client, { hash })
  const log = receipt.logs[0]
  expect(log.address).toBe(authority.address.toLowerCase())
  expect(
    decodeEventLog({
      abi: BatchCallInvoker.abi,
      ...log,
    }),
  ).toEqual({
    args: {
      data: '0x',
      to: recipient.address,
      value: parseEther('1'),
    },
    eventName: 'CallEmitted',
  })

  expect(
    await getBalance(client, {
      address: recipient.address,
    }),
  ).toBe(balance_recipient + parseEther('1'))
})

test('args: dataSuffix', async () => {
  const spy = vi.spyOn(client, 'sendTransaction')
  await writeContract(client, {
    abi: wagmiContractConfig.abi,
    address: wagmiContractConfig.address,
    account: accounts[0].address,
    functionName: 'mint',
    dataSuffix: '0x12345678',
  })
  expect(spy).toHaveBeenCalledWith({
    account: accounts[0].address,
    data: '0x1249c58b12345678',
    to: wagmiContractConfig.address,
  })
})

test('args: value', async () => {
  const { contractAddress } = await deployPayable()

  const hash_1 = await writeContract(clientWithAccount, {
    abi: Payable.abi,
    address: contractAddress!,
    functionName: 'pay',
  })
  const hash_2 = await writeContract(clientWithAccount, {
    abi: Payable.abi,
    address: contractAddress!,
    functionName: 'pay',
    value: 1n,
  })

  expect((await getTransaction(client, { hash: hash_1 })).value).toBe(0n)
  expect((await getTransaction(client, { hash: hash_2 })).value).toBe(1n)
})

test('overloaded function', async () => {
  expect(
    await writeContract(client, {
      ...wagmiContractConfig,
      account: accounts[0].address,
      functionName: 'mint',
      args: [13371337n],
    }),
  ).toBeDefined()
})

test('w/ simulateContract', async () => {
  const { request } = await simulateContract(client, {
    ...wagmiContractConfig,
    account: accounts[0].address,
    functionName: 'mint',
    args: [],
  })
  expect(await writeContract(client, request)).toBeDefined()

  await mine(client, { blocks: 1 })

  expect(
    await simulateContract(client, {
      ...wagmiContractConfig,
      account: accounts[0].address,
      functionName: 'mint',
    }),
  ).toBeDefined()
})

test('w/ simulateContract (overloaded)', async () => {
  const { request } = await simulateContract(client, {
    ...wagmiContractConfig,
    account: accounts[0].address,
    functionName: 'mint',
    args: [69421n],
  })
  expect(await writeContract(client, request)).toBeDefined()

  await mine(client, { blocks: 1 })

  await expect(() =>
    simulateContract(client, {
      ...wagmiContractConfig,
      account: accounts[0].address,
      functionName: 'mint',
      args: [69421n],
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [ContractFunctionExecutionError: The contract function "mint" reverted with the following reason:
    Token ID is taken

    Contract Call:
      address:   0x0000000000000000000000000000000000000000
      function:  mint(uint256 tokenId)
      args:          (69421)
      sender:    0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

    Docs: https://viem.sh/docs/contract/simulateContract
    Version: viem@x.y.z]
  `)
})

test('w/ simulateContract (args chain mismatch)', async () => {
  const { request } = await simulateContract(client, {
    ...wagmiContractConfig,
    account: accounts[0].address,
    functionName: 'mint',
    args: [],
    chain: optimism,
  })
  await expect(() =>
    writeContract(client, request),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [TransactionExecutionError: The current chain of the wallet (id: 1) does not match the target chain for the transaction (id: 10 – OP Mainnet).

    Current Chain ID:  1
    Expected Chain ID: 10 – OP Mainnet
     
    Request Arguments:
      chain:  OP Mainnet (id: 10)
      from:   0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      to:     0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
      data:   0x1249c58b

    Version: viem@x.y.z]
  `)
})

test('w/ simulateContract (client chain mismatch)', async () => {
  const client = createWalletClient({
    chain: optimism,
    transport: http(anvilMainnet.rpcUrl.http),
  })
  const { request } = await simulateContract(client, {
    ...wagmiContractConfig,
    account: accounts[0].address,
    functionName: 'mint',
    args: [],
  })
  await expect(() =>
    writeContract(client, request),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [TransactionExecutionError: The current chain of the wallet (id: 1) does not match the target chain for the transaction (id: 10 – OP Mainnet).

    Current Chain ID:  1
    Expected Chain ID: 10 – OP Mainnet
     
    Request Arguments:
      from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
      data:  0x1249c58b

    Version: viem@x.y.z]
  `)
})
