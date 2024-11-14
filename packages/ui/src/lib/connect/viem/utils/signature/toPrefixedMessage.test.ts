import { expect, test } from 'vitest'
import { stringToBytes } from '../encoding/toBytes'
import { stringToHex } from '../encoding/toHex'
import { toPrefixedMessage } from './toPrefixedMessage'

test('default', () => {
  expect(toPrefixedMessage('hello world')).toMatchInlineSnapshot(
    `"0x19457468657265756d205369676e6564204d6573736167653a0a313168656c6c6f20776f726c64"`,
  )
  expect(
    toPrefixedMessage({ raw: stringToHex('hello world') }),
  ).toMatchInlineSnapshot(
    `"0x19457468657265756d205369676e6564204d6573736167653a0a313168656c6c6f20776f726c64"`,
  )
  expect(
    toPrefixedMessage({ raw: stringToBytes('hello world') }),
  ).toMatchInlineSnapshot(
    `"0x19457468657265756d205369676e6564204d6573736167653a0a313168656c6c6f20776f726c64"`,
  )
})
