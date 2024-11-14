import { expect, test } from 'vitest'

import * as utils from './index.js'

test('exports utils', () => {
  expect(Object.keys(utils)).toMatchInlineSnapshot(`
    [
      "HDKey",
      "czech",
      "english",
      "french",
      "italian",
      "japanese",
      "korean",
      "simplifiedChinese",
      "spanish",
      "traditionalChinese",
      "generateMnemonic",
      "generatePrivateKey",
      "hdKeyToAccount",
      "mnemonicToAccount",
      "privateKeyToAccount",
      "toAccount",
      "sign",
      "signatureToHex",
      "serializeSignature",
      "experimental_signAuthorization",
      "signMessage",
      "signTransaction",
      "signTypedData",
      "parseAccount",
      "publicKeyToAddress",
      "privateKeyToAddress",
      "createNonceManager",
      "nonceManager",
    ]
  `)
})
