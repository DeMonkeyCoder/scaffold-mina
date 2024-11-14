import type { Abi } from 'abitype'

import {
  AbiConstructorNotFoundError,
  type AbiConstructorNotFoundErrorType,
  AbiConstructorParamsNotFoundError,
} from '../../errors/abi'
import type { ErrorType } from '../../errors/utils'
import type { ContractConstructorArgs } from '../../types/contract'
import type { Hex } from '../../types/misc'
import type { UnionEvaluate } from '../../types/utils'
import { type ConcatHexErrorType, concatHex } from '../data/concat'
import {
  type EncodeAbiParametersErrorType,
  encodeAbiParameters,
} from './encodeAbiParameters'

const docsPath = '/docs/contract/encodeDeployData'

export type EncodeDeployDataParameters<
  abi extends Abi | readonly unknown[] = Abi,
  ///
  hasConstructor = abi extends Abi
    ? Abi extends abi
      ? true
      : [Extract<abi[number], { type: 'constructor' }>] extends [never]
        ? false
        : true
    : true,
  allArgs = ContractConstructorArgs<abi>,
> = {
  abi: abi
  bytecode: Hex
} & UnionEvaluate<
  hasConstructor extends false
    ? { args?: undefined }
    : readonly [] extends allArgs
      ? { args?: allArgs | undefined }
      : { args: allArgs }
>

export type EncodeDeployDataReturnType = Hex

export type EncodeDeployDataErrorType =
  | AbiConstructorNotFoundErrorType
  | ConcatHexErrorType
  | EncodeAbiParametersErrorType
  | ErrorType

export function encodeDeployData<const abi extends Abi | readonly unknown[]>(
  parameters: EncodeDeployDataParameters<abi>,
): EncodeDeployDataReturnType {
  const { abi, args, bytecode } = parameters as EncodeDeployDataParameters
  if (!args || args.length === 0) return bytecode

  const description = abi.find((x) => 'type' in x && x.type === 'constructor')
  if (!description) throw new AbiConstructorNotFoundError({ docsPath })
  if (!('inputs' in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath })
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath })

  const data = encodeAbiParameters(description.inputs, args)
  return concatHex([bytecode, data!])
}
