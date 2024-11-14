import { expect, test } from 'vitest'
import { accounts } from '~test/src/constants'
import { blobData, kzg } from '~test/src/kzg'
import { anvilMainnet } from '../../../test/src/anvil'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount'
import { sepolia } from '../../chains/index'
import { http, createClient, parseGwei, stringToHex } from '../../index'
import { toBlobs } from '../../utils/blob/toBlobs'
import { getTransactionCount } from '../index'
import { prepareTransactionRequest } from './prepareTransactionRequest'
import { sendRawTransaction } from './sendRawTransaction'
import { signTransaction } from './signTransaction'

const client = anvilMainnet.getClient()

test('default', async () => {
  const request = await prepareTransactionRequest(client, {
    account: privateKeyToAccount(accounts[0].privateKey),
    to: accounts[1].address,
    value: 1n,
  })
  const serializedTransaction = await signTransaction(client, request)
  const hash = await sendRawTransaction(client, { serializedTransaction })
  expect(hash).toBeDefined()
})

test.skip('4844', async () => {
  const client = createClient({
    chain: sepolia,
    transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
  })

  const privateKey = '0x'
  const account = privateKeyToAccount(privateKey)
  const blobs = toBlobs({ data: stringToHex(blobData) })
  const nonce = await getTransactionCount(client, {
    address: account.address,
    blockTag: 'pending',
  })
  const serialized = await account.signTransaction({
    blobs,
    chainId: sepolia.id,
    kzg,
    maxFeePerBlobGas: parseGwei('100'),
    maxFeePerGas: parseGwei('100'),
    maxPriorityFeePerGas: parseGwei('5'),
    nonce,
    gas: 21000n,
    to: '0x0000000000000000000000000000000000000000',
    type: 'eip4844',
  })
  const hash = await sendRawTransaction(client, {
    serializedTransaction: serialized,
  })
  expect(hash).toBeDefined()
}, 20_000)
