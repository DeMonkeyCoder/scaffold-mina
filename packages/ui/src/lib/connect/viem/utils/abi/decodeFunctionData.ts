import type { Abi, AbiStateMutability } from 'abitype'

import { AbiFunctionSignatureNotFoundError } from '../../errors/abi'
import type { ErrorType } from '../../errors/utils'
import type {
  ContractFunctionArgs,
  ContractFunctionName,
} from '../../types/contract'
import type { Hex } from '../../types/misc'
import type { IsNarrowable, UnionEvaluate } from '../../types/utils'
import { type SliceErrorType, slice } from '../data/slice'
import {
  type ToFunctionSelectorErrorType,
  toFunctionSelector,
} from '../hash/toFunctionSelector'
import {
  type DecodeAbiParametersErrorType,
  decodeAbiParameters,
} from './decodeAbiParameters'
import { type FormatAbiItemErrorType, formatAbiItem } from './formatAbiItem'

export type DecodeFunctionDataParameters<
  abi extends Abi | readonly unknown[] = Abi,
> = {
  abi: abi
  data: Hex
}

export type DecodeFunctionDataReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  ///
  allFunctionNames extends
    ContractFunctionName<abi> = ContractFunctionName<abi>,
> = IsNarrowable<abi, Abi> extends true
  ? UnionEvaluate<
      {
        [functionName in allFunctionNames]: {
          args: ContractFunctionArgs<abi, AbiStateMutability, functionName>
          functionName: functionName
        }
      }[allFunctionNames]
    >
  : {
      args: readonly unknown[] | undefined
      functionName: string
    }

export type DecodeFunctionDataErrorType =
  | AbiFunctionSignatureNotFoundError
  | DecodeAbiParametersErrorType
  | FormatAbiItemErrorType
  | ToFunctionSelectorErrorType
  | SliceErrorType
  | ErrorType

export function decodeFunctionData<const abi extends Abi | readonly unknown[]>(
  parameters: DecodeFunctionDataParameters<abi>,
) {
  const { abi, data } = parameters as DecodeFunctionDataParameters
  const signature = slice(data, 0, 4)
  const description = abi.find(
    (x) =>
      x.type === 'function' &&
      signature === toFunctionSelector(formatAbiItem(x)),
  )
  if (!description)
    throw new AbiFunctionSignatureNotFoundError(signature, {
      docsPath: '/docs/contract/decodeFunctionData',
    })
  return {
    functionName: (description as { name: string }).name,
    args: ('inputs' in description &&
    description.inputs &&
    description.inputs.length > 0
      ? decodeAbiParameters(description.inputs, slice(data, 4))
      : undefined) as readonly unknown[] | undefined,
  } as DecodeFunctionDataReturnType<abi>
}
