import type { ByteArray, Hex } from '../../../types/misc'
import {
  type EncodeFunctionDataReturnType,
  encodeFunctionData,
} from '../../../utils/abi/encodeFunctionData'
import { bytesToHex } from '../../../utils/encoding/toHex'
import { paymasterAbi } from '../../constants/abis'

export type GetGeneralPaymasterInputParameters = {
  innerInput: Hex | ByteArray
}

export type GetGeneralPaymasterInputReturnType = EncodeFunctionDataReturnType

export function getGeneralPaymasterInput(
  parameters: GetGeneralPaymasterInputParameters,
): GetGeneralPaymasterInputReturnType {
  const { innerInput } = parameters

  const innerInputHex =
    typeof innerInput === 'string' ? innerInput : bytesToHex(innerInput)

  return encodeFunctionData({
    abi: paymasterAbi,
    functionName: 'general',
    args: [innerInputHex],
  })
}
