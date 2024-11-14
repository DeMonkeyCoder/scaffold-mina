import type { TypedData } from 'abitype'

import type { Hex } from '../../types/misc'
import type { TypedDataDefinition } from '../../types/typedData'
import {
  type HashTypedDataErrorType,
  hashTypedData,
} from '../../utils/signature/hashTypedData'

import type { ErrorType } from '../../errors/utils'
import { type SignErrorType, sign } from './sign'

export type SignTypedDataParameters<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | 'EIP712Domain' = keyof typedData,
> = TypedDataDefinition<typedData, primaryType> & {
  /** The private key to sign with. */
  privateKey: Hex
}

export type SignTypedDataReturnType = Hex

export type SignTypedDataErrorType =
  | HashTypedDataErrorType
  | SignErrorType
  | ErrorType

/**
 * @description Signs typed data and calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191):
 * `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * @returns The signature.
 */
export async function signTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | 'EIP712Domain',
>(
  parameters: SignTypedDataParameters<typedData, primaryType>,
): Promise<SignTypedDataReturnType> {
  const { privateKey, ...typedData } =
    parameters as unknown as SignTypedDataParameters
  return await sign({
    hash: hashTypedData(typedData),
    privateKey,
    to: 'hex',
  })
}
