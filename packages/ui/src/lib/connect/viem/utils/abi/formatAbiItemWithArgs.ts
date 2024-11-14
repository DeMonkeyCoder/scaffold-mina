import type { AbiParameter } from 'abitype'

import type { ErrorType } from '../../errors/utils'
import type { AbiItem } from '../../types/contract'
import { stringify } from '../stringify'

export type FormatAbiItemWithArgsErrorType = ErrorType

export function formatAbiItemWithArgs({
  abiItem,
  args,
  includeFunctionName = true,
  includeName = false,
}: {
  abiItem: AbiItem
  args: readonly unknown[]
  includeFunctionName?: boolean | undefined
  includeName?: boolean | undefined
}) {
  if (!('name' in abiItem)) return
  if (!('inputs' in abiItem)) return
  if (!abiItem.inputs) return
  return `${includeFunctionName ? abiItem.name : ''}(${abiItem.inputs
    .map(
      (input: AbiParameter, i: number) =>
        `${includeName && input.name ? `${input.name}: ` : ''}${
          typeof args[i] === 'object' ? stringify(args[i]) : args[i]
        }`,
    )
    .join(', ')})`
}
