import { secp256k1 } from '@noble/curves/secp256k1'

import type { Hex } from '../types/misc'
import { type ToHexErrorType, toHex } from '../utils/encoding/toHex'

import type { ErrorType } from '../errors/utils'
import type { NonceManager } from '../utils/nonceManager'
import { type ToAccountErrorType, toAccount } from './toAccount'
import type { PrivateKeyAccount } from './types'
import {
  type PublicKeyToAddressErrorType,
  publicKeyToAddress,
} from './utils/publicKeyToAddress'
import { type SignErrorType, sign } from './utils/sign'
import { experimental_signAuthorization } from './utils/signAuthorization'
import { type SignMessageErrorType, signMessage } from './utils/signMessage'
import {
  type SignTransactionErrorType,
  signTransaction,
} from './utils/signTransaction'
import {
  type SignTypedDataErrorType,
  signTypedData,
} from './utils/signTypedData'

export type PrivateKeyToAccountOptions = {
  nonceManager?: NonceManager | undefined
}

export type PrivateKeyToAccountErrorType =
  | ToAccountErrorType
  | ToHexErrorType
  | PublicKeyToAddressErrorType
  | SignErrorType
  | SignMessageErrorType
  | SignTransactionErrorType
  | SignTypedDataErrorType
  | ErrorType

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount(
  privateKey: Hex,
  options: PrivateKeyToAccountOptions = {},
): PrivateKeyAccount {
  const { nonceManager } = options
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false))
  const address = publicKeyToAddress(publicKey)

  const account = toAccount({
    address,
    nonceManager,
    async sign({ hash }) {
      return sign({ hash, privateKey, to: 'hex' })
    },
    async experimental_signAuthorization(authorization) {
      return experimental_signAuthorization({ ...authorization, privateKey })
    },
    async signMessage({ message }) {
      return signMessage({ message, privateKey })
    },
    async signTransaction(transaction, { serializer } = {}) {
      return signTransaction({ privateKey, transaction, serializer })
    },
    async signTypedData(typedData) {
      return signTypedData({ ...typedData, privateKey })
    },
  })

  return {
    ...account,
    publicKey,
    source: 'privateKey',
  } as PrivateKeyAccount
}
