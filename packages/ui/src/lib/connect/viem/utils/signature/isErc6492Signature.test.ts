import { expect, test } from 'vitest'
import { accounts } from '../../../test/src/constants'
import { signMessage } from '../../accounts/index'
import { isErc6492Signature } from './isErc6492Signature'
import { serializeErc6492Signature } from './serializeErc6492Signature'

test('default', async () => {
  const signature = await signMessage({
    message: 'hello world',
    privateKey: accounts[0].privateKey,
  })

  expect(isErc6492Signature(signature)).toBe(false)

  const erc6492Signature = serializeErc6492Signature({
    address: '0xcafebabecafebabecafebabecafebabecafebabe',
    data: '0xdeadbeef',
    signature,
  })
  expect(isErc6492Signature(erc6492Signature)).toBe(true)
})
