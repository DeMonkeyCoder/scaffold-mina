import type { ErrorType } from '../../../errors/utils'
import type { RpcEstimateUserOperationGasReturnType } from '../../types/rpc'
import type { EstimateUserOperationGasReturnType } from '../../types/userOperation'

export type FormatUserOperationGasErrorType = ErrorType

export function formatUserOperationGas(
  parameters: RpcEstimateUserOperationGasReturnType,
): EstimateUserOperationGasReturnType {
  const gas = {} as EstimateUserOperationGasReturnType

  if (parameters.callGasLimit)
    gas.callGasLimit = BigInt(parameters.callGasLimit)
  if (parameters.preVerificationGas)
    gas.preVerificationGas = BigInt(parameters.preVerificationGas)
  if (parameters.verificationGasLimit)
    gas.verificationGasLimit = BigInt(parameters.verificationGasLimit)
  if (parameters.paymasterPostOpGasLimit)
    gas.paymasterPostOpGasLimit = BigInt(parameters.paymasterPostOpGasLimit)
  if (parameters.paymasterVerificationGasLimit)
    gas.paymasterVerificationGasLimit = BigInt(
      parameters.paymasterVerificationGasLimit,
    )

  return gas
}
