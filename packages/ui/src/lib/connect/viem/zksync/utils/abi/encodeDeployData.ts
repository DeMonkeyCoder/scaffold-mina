import type { Abi } from 'abitype'

import { zeroHash } from '../../../constants/bytes'
import {
  AbiConstructorNotFoundError,
  AbiConstructorParamsNotFoundError,
} from '../../../errors/abi'
import type { ErrorType } from '../../../errors/utils'
import type { ContractConstructorArgs } from '../../../types/contract'
import type { Hash } from '../../../types/misc'
import type { Hex } from '../../../types/misc'
import { encodeAbiParameters } from '../../../utils/abi/encodeAbiParameters'
import type {
  EncodeDeployDataParameters as EncodeDeployDataParameters_,
  EncodeDeployDataReturnType,
} from '../../../utils/abi/encodeDeployData'
import {
  type EncodeFunctionDataErrorType,
  encodeFunctionData,
} from '../../../utils/abi/encodeFunctionData'
import { toHex } from '../../../utils/encoding/toHex'
import { contractDeployerAbi } from '../../constants/abis'
import { accountAbstractionVersion1 } from '../../constants/contract'
import type { ContractDeploymentType } from '../../types/contract'
import { type HashBytecodeErrorType, hashBytecode } from '../hashBytecode'

const docsPath = '/docs/contract/encodeDeployData'

/** @internal */
export type EncodeDeployDataParameters<
  abi extends Abi | readonly unknown[] = Abi,
  hasConstructor = abi extends Abi
    ? Abi extends abi
      ? true
      : [Extract<abi[number], { type: 'constructor' }>] extends [never]
        ? false
        : true
    : true,
  allArgs = ContractConstructorArgs<abi>,
> = EncodeDeployDataParameters_<abi, hasConstructor, allArgs> & {
  deploymentType?: ContractDeploymentType | undefined
  salt?: Hash | undefined
}

export type EncodeDeployDataErrorType =
  | EncodeFunctionDataErrorType
  | HashBytecodeErrorType
  | ErrorType

export function encodeDeployData<const abi extends Abi | readonly unknown[]>(
  parameters: EncodeDeployDataParameters<abi>,
): EncodeDeployDataReturnType {
  const { abi, args, bytecode, deploymentType, salt } =
    parameters as EncodeDeployDataParameters

  if (!args || args.length === 0) {
    const { functionName, argsContractDeployer } = getDeploymentDetails(
      deploymentType,
      salt ?? zeroHash,
      toHex(hashBytecode(bytecode)),
      '0x',
    )
    return encodeFunctionData({
      abi: contractDeployerAbi,
      functionName,
      args: argsContractDeployer,
    })
  }

  const description = abi.find((x) => 'type' in x && x.type === 'constructor')
  if (!description) throw new AbiConstructorNotFoundError({ docsPath })
  if (!('inputs' in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath })
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath })

  const data = encodeAbiParameters(description.inputs, args)
  const { functionName, argsContractDeployer } = getDeploymentDetails(
    deploymentType,
    salt ?? zeroHash,
    toHex(hashBytecode(bytecode)),
    data,
  )

  return encodeFunctionData({
    abi: contractDeployerAbi,
    functionName,
    args: argsContractDeployer,
  })
}

function getDeploymentDetails(
  deploymentType: ContractDeploymentType,
  salt: Hash,
  bytecodeHash: Hex,
  data: Hex,
): {
  functionName: string
  argsContractDeployer: readonly unknown[]
} {
  const contractDeploymentArgs = [salt, bytecodeHash, data]

  const deploymentOptions = {
    create: {
      functionName: 'create',
      argsContractDeployer: contractDeploymentArgs,
    },
    create2: {
      functionName: 'create2',
      argsContractDeployer: contractDeploymentArgs,
    },
    createAccount: {
      functionName: 'createAccount',
      argsContractDeployer: [
        ...contractDeploymentArgs,
        accountAbstractionVersion1,
      ],
    },
    create2Account: {
      functionName: 'create2Account',
      argsContractDeployer: [
        ...contractDeploymentArgs,
        accountAbstractionVersion1,
      ],
    },
  }

  const deploymentKey = deploymentType || 'create'
  return deploymentOptions[deploymentKey]
}
