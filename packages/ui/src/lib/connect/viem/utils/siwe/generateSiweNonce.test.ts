import { expect, test } from 'vitest'

import { generateSiweNonce } from './generateSiweNonce'

test('default', () => {
  const nonce = generateSiweNonce()
  expect(nonce.length).toMatchInlineSnapshot('96')
})
