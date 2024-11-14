import type { TypedData, TypedDataDomain, TypedDataParameter } from 'abitype'

import { BytesSizeMismatchError } from '../errors/abi'
import { InvalidAddressError } from '../errors/address'
import type { Hex } from '../types/misc'
import type { TypedDataDefinition } from '../types/typedData'

import type { ErrorType } from '../errors/utils'
import { type IsAddressErrorType, isAddress } from './address/isAddress'
import { type SizeErrorType, size } from './data/size'
import { type NumberToHexErrorType, numberToHex } from './encoding/toHex'
import { bytesRegex, integerRegex } from './regex'
import {
  type HashDomainErrorType,
  hashDomain,
} from './signature/hashTypedData'
import { stringify } from './stringify'

export type SerializeTypedDataErrorType =
  | HashDomainErrorType
  | IsAddressErrorType
  | NumberToHexErrorType
  | SizeErrorType
  | ErrorType

export function serializeTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | 'EIP712Domain',
>(parameters: TypedDataDefinition<typedData, primaryType>) {
  const {
    domain: domain_,
    message: message_,
    primaryType,
    types,
  } = parameters as unknown as TypedDataDefinition

  const normalizeData = (
    struct: readonly TypedDataParameter[],
    data_: Record<string, unknown>,
  ) => {
    const data = { ...data_ }
    for (const param of struct) {
      const { name, type } = param
      if (type === 'address') data[name] = (data[name] as string).toLowerCase()
    }
    return data
  }

  const domain = (() => {
    if (!types.EIP712Domain) return {}
    if (!domain_) return {}
    return normalizeData(types.EIP712Domain, domain_)
  })()

  const message = (() => {
    if (primaryType === 'EIP712Domain') return undefined
    return normalizeData(types[primaryType], message_)
  })()

  return stringify({ domain, message, primaryType, types })
}

export type ValidateTypedDataErrorType =
  | HashDomainErrorType
  | IsAddressErrorType
  | NumberToHexErrorType
  | SizeErrorType
  | ErrorType

export function validateTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | 'EIP712Domain',
>(parameters: TypedDataDefinition<typedData, primaryType>) {
  const { domain, message, primaryType, types } =
    parameters as unknown as TypedDataDefinition

  const validateData = (
    struct: readonly TypedDataParameter[],
    data: Record<string, unknown>,
  ) => {
    for (const param of struct) {
      const { name, type } = param
      const value = data[name]

      const integerMatch = type.match(integerRegex)
      if (
        integerMatch &&
        (typeof value === 'number' || typeof value === 'bigint')
      ) {
        const [_type, base, size_] = integerMatch
        // If number cannot be cast to a sized hex value, it is out of range
        // and will throw.
        numberToHex(value, {
          signed: base === 'int',
          size: Number.parseInt(size_) / 8,
        })
      }

      if (type === 'address' && typeof value === 'string' && !isAddress(value))
        throw new InvalidAddressError({ address: value })

      const bytesMatch = type.match(bytesRegex)
      if (bytesMatch) {
        const [_type, size_] = bytesMatch
        if (size_ && size(value as Hex) !== Number.parseInt(size_))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_),
            givenSize: size(value as Hex),
          })
      }

      const struct = types[type]
      if (struct) validateData(struct, value as Record<string, unknown>)
    }
  }

  // Validate domain types.
  if (types.EIP712Domain && domain) validateData(types.EIP712Domain, domain)

  // Validate message types.
  if (primaryType !== 'EIP712Domain') validateData(types[primaryType], message)
}

export type GetTypesForEIP712DomainErrorType = ErrorType

export function getTypesForEIP712Domain({
  domain,
}: { domain?: TypedDataDomain | undefined }): TypedDataParameter[] {
  return [
    typeof domain?.name === 'string' && { name: 'name', type: 'string' },
    domain?.version && { name: 'version', type: 'string' },
    typeof domain?.chainId === 'number' && {
      name: 'chainId',
      type: 'uint256',
    },
    domain?.verifyingContract && {
      name: 'verifyingContract',
      type: 'address',
    },
    domain?.salt && { name: 'salt', type: 'bytes32' },
  ].filter(Boolean) as TypedDataParameter[]
}

export type DomainSeparatorErrorType =
  | GetTypesForEIP712DomainErrorType
  | HashDomainErrorType
  | ErrorType

export function domainSeparator({ domain }: { domain: TypedDataDomain }): Hex {
  return hashDomain({
    domain,
    types: {
      EIP712Domain: getTypesForEIP712Domain({ domain }),
    },
  })
}
